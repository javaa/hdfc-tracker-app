
import React, { useState } from 'react';
import { router, usePage, Link } from "@inertiajs/react";
import { Head } from '@inertiajs/react';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import AuthenticatedLayout from "../../Layouts/AuthenticatedLayout";
import AddProject from '../../Components/Project/AddProject';
import ProjectTimeline from '../../Components/Project/ProjectTimeLine';
import PTimeline from '../../Components/Project/PTimeLine';
import Pagination from '../../Components/Pagination';

export default function ProjectManage({ projects }) {
  const { auth } = usePage().props;
  const [open, setOpen] = useState(false);

  const timelineBodyTemplate = (rowData) => {
    return <ProjectTimeline projectData={rowData} />;
    // return <PTimeline milestones={rowData.milestones} />;
  };

  return (
    <AuthenticatedLayout>
      <Head title="ProjectManage" />
      <div className="p-6 min-h-screen max-w-7xl mx-auto">
        <div className='flex justify-between'>
          <h1 className="text-3xl font-bold mb-6">Manage Projects</h1>
          <Button label='Add Project' onClick={() => setOpen(true)} icon="pi pi-plus text-sm" />
        </div>
        <div className='mt-5'>
          <DataTable showGridlines className='custom-datatable mt-6' value={projects.data} size="small" breakpoint="960px" emptyMessage="No Projects found.">
            {/* <Column field="projectTitle" header="Project Title"  /> */}
            {/* <Column field="projectCreator" header="Project Creator" /> */}
            <Column className="text-sm" body={timelineBodyTemplate} />
            {/* <Column header="Action" className="text-sm" body={actionBodyTemplate}/> */}
          </DataTable>
          {projects.total >= 10 && (
                        <div className='my-2 p-2 bg-white w-full justify-center'>
                            <Pagination links={projects.links} />
                        </div>
                    )}
        </div>
      </div>
      <AddProject open={open} setOpen={setOpen} />
      <style jsx="true">{`
                .custom-datatable.p-datatable .p-datatable-thead > tr > th {
                  background: #f3f4f6;
                  border: none;
                  color: #52525b;
                }
                .custom-datatable.p-datatable .p-datatable-row-expansion {
                  background: #f9fafb;
                }
            `}</style>
    </AuthenticatedLayout>
  );
}