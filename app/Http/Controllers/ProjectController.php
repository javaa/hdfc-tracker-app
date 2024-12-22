<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\ProjectMileStone;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Carbon\Carbon;
use DateTimeInterface;
use Illuminate\Support\Facades\Storage;

class ProjectController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $user = session()->get('user');
        if (!$user) {
            return redirect()->route('login');
        }
        $query = Project::with('milestones.images')->orderBy('created_at', 'desc');
        if ($request->has('search')) {
            $searchTerm = $request->input('search');
            $query->where(function ($q) use ($searchTerm) {
                $q->where('projectTitle', 'like', "%{$searchTerm}%");
            });
        }

        $projects = $query->paginate(10)->withQueryString();

        return Inertia::render('Project/ProjectManage', [
            'filters' => $request->only('search'),
            'projects' => $projects
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Validate the main project data and milestone array
        $request->validate([
            'projectTitle' => 'required|string|max:255',
            'projectCreator' => 'required|string|max:255',
            'milestones' => 'required|array|min:1',
            'milestones.*.milestoneTitle' => 'required|string|max:255',
            'milestones.*.estimateStartDate' => 'nullable|date',
            'milestones.*.estimateEndDate' => 'nullable|date|after_or_equal:milestones.*.estimateStartDate',
            'milestones.*.actualStartDate' => 'nullable|date',
            'milestones.*.actualEndDate' => 'nullable|date|after_or_equal:milestones.*.actualStartDate',
            'milestones.*.images' => 'nullable|array',
            'milestones.*.images.*.image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'milestones.*.images.*.geoLocation' => 'nullable|array'
        ], [
            'milestones.*.milestoneTitle.required' => 'Each milestone must have a title.',
            'milestones.*.estimateEndDate.after_or_equal' => 'Estimated end date must be after or equal to the estimated start date.',
            'milestones.*.actualEndDate.after_or_equal' => 'Actual end date must be after or equal to the actual start date.',
        ]);

        try {
            // Use database transaction to ensure data consistency
            DB::beginTransaction();

            // Create the project
            $project = new Project();
            $project->projectTitle = $request->projectTitle;
            $project->projectCreator = $request->projectCreator;
            $project->slug = Str::random(20);
            $project->save();

            // Process each milestone
            foreach ($request->milestones as $index => $milestoneData) {
                $milestone = new ProjectMileStone();
                $milestone->projectId = $project->id;
                $milestone->milestoneTitle = $milestoneData['milestoneTitle'];
                $milestone->estimateStartDate = !empty($milestoneData['estimateStartDate']) ? Carbon::parse($milestoneData['estimateStartDate']) : null;
                $milestone->estimateEndDate = !empty($milestoneData['estimateEndDate']) ? Carbon::parse($milestoneData['estimateEndDate']) : null;
                $milestone->actualStartDate = !empty($milestoneData['actualStartDate']) ? Carbon::parse($milestoneData['actualStartDate']) : null;
                $milestone->actualEndDate = !empty($milestoneData['actualEndDate']) ? Carbon::parse($milestoneData['actualEndDate']) : null;
                $milestone->status = 'pending';
                $milestone->order = $index + 1;
                $milestone->save();

                // Handle images if they exist
                if (!empty($milestoneData['images'])) {
                    foreach ($milestoneData['images'] as $imageData) {
                        if (!empty($imageData['image'])) {
                            // Store the image
                            $path = $imageData['image']->store('milestone-images', 'public');
                            $coordinates = $this->convertExifGpsToDecimal($imageData['image']);
                            // Create image record
                            $milestone->images()->create([
                                'image' => $path,
                                'geoLocation' => $coordinates ?? null,
                            ]);
                        }
                    }
                }
            }

            DB::commit();

            return redirect()
                ->route('project.index')
                ->with('success', "{$project->projectTitle} created successfully with " .
                    count($request->milestones) . " milestone(s).");

        } catch (\Exception $e) {
            DB::rollBack();

            // Clean up any uploaded files if there was an error
            if (isset($path)) {
                Storage::disk('public')->delete($path);
            }

            return redirect()
                ->back()
                ->withInput()
                ->with('error', $e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Project $project)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Project $project)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Project $project)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Project $project)
    {
        //
    }

    /**
     * Parse various date formats to Carbon instance
     *
     * @param mixed $date
     * @return Carbon|null
     */
    private function parseDateToCarbon($date)
    {
        if (empty($date)) {
            return null;
        }

        try {
            // If it's already a Carbon instance, return it
            if ($date instanceof Carbon) {
                return $date;
            }

            // If it's a DateTimeInterface, convert to Carbon
            if ($date instanceof DateTimeInterface) {
                return Carbon::instance($date);
            }

            // If it's a timestamp (from JavaScript Date)
            if (is_numeric($date)) {
                return Carbon::createFromTimestamp($date / 1000);
            }

            // If it's an ISO 8601 string (default JSON date format)
            if (is_string($date)) {
                return Carbon::parse($date);
            }

            return null;
        } catch (\Exception $e) {
            return null;
        }
    }

    private function convertDMSToDecimal($dmsArray) {
        // Convert DMS array to decimal
        $degrees = floatval($dmsArray[0]);
        $minutes = floatval($dmsArray[1]) / 60;
        $seconds = floatval($dmsArray[2]) / 3600;
    
        return $degrees + $minutes + $seconds;
    }

    private function convertExifGpsToDecimal($imagePath) {
        // Read EXIF data
        $exifData = exif_read_data($imagePath);
    
        // Check if GPS data exists
        if (!isset($exifData['GPSLatitude']) || !isset($exifData['GPSLongitude'])) {
            // throw new Exception("No GPS data found in image.");
            return;
        }
    
        // Extract latitude and longitude references
        $latitudeRef = $exifData['GPSLatitudeRef'];
        $longitudeRef = $exifData['GPSLongitudeRef'];
    
        // Convert latitude
        $latitudeDMS = implode(' ', $exifData['GPSLatitude']);
        $decimalLatitude = $this->convertDMSToDecimal($latitudeDMS);
        
        // Convert longitude
        $longitudeDMS = implode(' ', $exifData['GPSLongitude']);
        $decimalLongitude = $this->convertDMSToDecimal($longitudeDMS);
    
        // Adjust for direction
        if ($latitudeRef === 'S') {
            $decimalLatitude = -$decimalLatitude;
        }
        if ($longitudeRef === 'W') {
            $decimalLongitude = -$decimalLongitude;
        }
    
        return [
            'latitude' => $decimalLatitude,
            'longitude' => $decimalLongitude,
        ];
    }
    
}
