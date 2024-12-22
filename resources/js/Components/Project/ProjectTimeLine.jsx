import React, { useEffect, useState } from "react";
import { Card } from "primereact/card";
import { Image } from 'primereact/image';

const formatDate = (dateString) => {
    if (!dateString) return "Not set";
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString();
    } catch (e) {
        return "Invalid date";
    }
};

const safeDate = (dateString) => {
    if (!dateString) return null;
    try {
        const date = new Date(dateString);
        return isNaN(date.getTime()) ? null : date;
    } catch (e) {
        return null;
    }
};

const ProjectTimeline = ({ projectData }) => {
    const [milestones, setMilestones] = useState([]);
    const renderMilestoneImages = (images) => {
      if (!images || !Array.isArray(images) || images.length === 0) return null;
  
      return (
        <div className="flex flex-wrap gap-2 mt-2">
          {images.map((imageData, index) => {
            // Handle the image path from your data structure
            const imagePath = imageData.image;
            // Remove 'milestone-images/' from the path if it exists in the data
            const cleanPath = imagePath.includes('milestone-images/') 
              ? imagePath 
              : `milestone-images/${imagePath}`;
  
            return (
              <div className="flex flex-col gap-2" key={index}>
              <div>
              <Image
                key={imageData.id || index}
                src={`/storage/${cleanPath}`}
                alt={`Milestone ${index + 1}`}
                width="50"
                height="50"
                preview
                className="border rounded-md object-cover"
              />
              </div>
              <div className="">
                {imageData.geoLocation && (
                  <p className="text-sm text-gray-500">
                    Latitude: {imageData.geoLocation.latitude}, Longitude: {imageData.geoLocation.longitude}
                  </p>
                )}
              </div>
              </div>
            );
          })}
        </div>
      );
    };
    useEffect(() => {
        if (projectData?.milestones?.length > 0) {
            const calculatedMilestones = projectData.milestones.map(
                (milestone) => {
                    const today = new Date();
                    const estimateStart = safeDate(milestone.estimateStartDate);
                    const estimateEnd = safeDate(milestone.estimateEndDate);
                    const actualStart = safeDate(milestone.actualStartDate);
                    const actualEnd = safeDate(milestone.actualEndDate);

                    // Skip invalid dates
                    if (!estimateStart || !estimateEnd) {
                        return {
                            title:
                                milestone.milestoneTitle || "Unnamed Milestone",
                            progress: 0,
                            status: "not-started",
                            statusIcon: "pi pi-clock",
                            estimateStart: null,
                            estimateEnd: null,
                            actualStart: null,
                            actualEnd: null,
                            delay: 0,
                            delayText: "Invalid dates",
                            plannedDuration: 0,
                        };
                    }

                    // Calculate planned duration
                    const plannedDuration = estimateEnd - estimateStart;

                    // Calculate actual duration and delay
                    let actualDuration = 0;
                    let delay = 0;
                    let delayText = "";

                    if (actualEnd && actualStart) {
                        actualDuration = actualEnd - actualStart;
                        delay = actualDuration - plannedDuration;
                        delayText = `${Math.abs(
                            Math.ceil(delay / (1000 * 60 * 60 * 24))
                        )} days ${delay > 0 ? "overrun" : "ahead"}`;
                    } else if (actualStart) {
                        actualDuration = today - actualStart;
                        if (today > estimateEnd) {
                            delay = today - estimateEnd;
                            delayText = `${Math.ceil(
                                delay / (1000 * 60 * 60 * 24)
                            )} days overdue`;
                        }
                    } else if (today > estimateStart) {
                        delay = today - estimateStart;
                        delayText = `Start delayed by ${Math.ceil(
                            delay / (1000 * 60 * 60 * 24)
                        )} days`;
                    }

                    // Calculate progress
                    let progress = 0;
                    if (actualEnd) {
                        progress = 100;
                    } else if (actualStart) {
                        const elapsed = today - actualStart;
                        progress = Math.min(
                            Math.round((elapsed / plannedDuration) * 100),
                            100
                        );
                    }

                    // Determine status
                    let status = "not-started";
                    let statusIcon = "pi pi-clock";
                    if (actualEnd) {
                        status = "completed";
                        statusIcon = "pi pi-check-circle";
                    } else if (today > estimateEnd && !actualEnd) {
                        status = "delayed";
                        statusIcon = "pi pi-exclamation-circle";
                    } else if (progress > 0) {
                        status = "in-progress";
                        statusIcon = "pi pi-play";
                    }

                    return {
                        title: milestone.milestoneTitle || "Unnamed Milestone",
                        progress,
                        status,
                        statusIcon,
                        estimateStart,
                        estimateEnd,
                        actualStart,
                        actualEnd,
                        delay,
                        delayText,
                        plannedDuration,
                        images: milestone.images,
                    };
                }
            );
            setMilestones(calculatedMilestones);
        }
    }, [projectData]);

    const recalculateTimeline = (milestones) => {
        // Map over milestones and convert date strings to Date objects
        const startDates = milestones
            .map((milestone) => {
                const startDate = milestone.estimateStartDate
                    ? new Date(milestone.estimateStartDate)
                    : null;
                return startDate;
            })
            .filter((date) => date !== null); // Filter out null values

        const endDates = milestones
            .map((milestone) => {
                const endDate = milestone.estimateEndDate
                    ? new Date(milestone.estimateEndDate)
                    : null;
                return endDate;
            })
            .filter((date) => date !== null); // Filter out null values

        // Check if we have valid dates before calculating min/max
        const overallStartDate =
            startDates.length > 0 ? new Date(Math.min(...startDates)) : null;
        const overallEndDate =
            endDates.length > 0 ? new Date(Math.max(...endDates)) : null;

        return { overallStartDate, overallEndDate };
    };

    // Function to calculate the number of days between two dates
    const calculateDaysBetween = (startDate, endDate) => {
        if (!startDate || !endDate) {
            return 0; // Return 0 if any date is invalid
        }

        const timeDiff = endDate - startDate; // Time difference in milliseconds
        const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24)); // Convert milliseconds to days
        return daysDiff;
    };

    const { overallStartDate, overallEndDate } = recalculateTimeline(
        projectData.milestones
    );
    const totalDays = calculateDaysBetween(overallStartDate, overallEndDate);
    const header = (
        <>
            <div className="flex justify-between items-center p-3">
                <h2 className="text-xl font-bold m-0">
                    {projectData?.projectTitle || "Untitled Project"}
                </h2>

                <span className="text-sm text-gray-500">
                    Created by: {projectData?.projectCreator || "Unknown"}
                </span>
            </div>
            <div className="flex px-3 text-sm space-x-4">
                <p>
                    <strong>Start Date:</strong>{" "}
                    {overallStartDate.toLocaleDateString()}
                </p>
                <p>
                    <strong>End Date:</strong>{" "}
                    {overallEndDate.toLocaleDateString()}
                </p>
                <p>
                    <strong>No. of Days:</strong> {totalDays}
                </p>
            </div>
        </>
    );

    return (
        <Card header={header} className="w-full">
            <div className="space-y-6">
                <div className="space-y-6">
                    {milestones.map((milestone, index) => (
                        <div key={index} className="space-y-2">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <i
                                        className={`${milestone.statusIcon} ${
                                            milestone.status === "completed"
                                                ? "text-green-500"
                                                : milestone.status === "delayed"
                                                ? "text-red-500"
                                                : milestone.status ===
                                                  "in-progress"
                                                ? "text-orange-500"
                                                : "text-blue-500"
                                        }`}
                                    />
                                    <span className="font-medium">
                                        {milestone.title}
                                    </span>
                                </div>
                                <span className="text-sm">
                                    {milestone.progress}%
                                </span>
                            </div>

                            <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden relative">
                                <div
                                    className={`h-full transition-all duration-500 ${
                                        milestone.status === "completed"
                                            ? "bg-green-500"
                                            : milestone.status === "delayed"
                                            ? "bg-red-500"
                                            : milestone.status === "in-progress"
                                            ? "bg-orange-500"
                                            : "bg-blue-500"
                                    }`}
                                    style={{ width: `${milestone.progress}%` }}
                                />
                            </div>

                            <div className="flex justify-between text-sm text-gray-600">
                                <div>
                                    Planned:{" "}
                                    {milestone.estimateStart
                                        ? formatDate(milestone.estimateStart)
                                        : "Not set"}{" "}
                                    -{" "}
                                    {milestone.estimateEnd
                                        ? formatDate(milestone.estimateEnd)
                                        : "Not set"}
                                </div>
                                {milestone.delay !== 0 && (
                                    <div
                                        className={`font-medium ${
                                            milestone.delay > 0
                                                ? "text-red-500"
                                                : "text-green-500"
                                        }`}
                                    >
                                        {milestone.delayText}
                                    </div>
                                )}
                            </div>
                            <div className="flex">
                              {renderMilestoneImages(milestone.images)}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex gap-4 text-xs">
                    <div className="flex items-center gap-2">
                        <i className="pi pi-check-circle text-green-500" />
                        <span>Completed</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <i className="pi pi-play text-orange-500" />
                        <span>In Progress</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <i className="pi pi-exclamation-circle text-red-500" />
                        <span>Delayed</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <i className="pi pi-clock text-blue-500" />
                        <span>Not Started</span>
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default ProjectTimeline;
