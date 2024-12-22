import React, { useState, useEffect } from "react";
import { Link, router, useForm, usePage } from "@inertiajs/react";
import { Sidebar } from "primereact/sidebar";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Calendar } from "primereact/calendar";

export default function AddProject({ open, setOpen }) {
    const { auth } = usePage().props;
    const [isSmallScreen, setIsSmallScreen] = useState(
        window.innerWidth <= 767
    );
    const {
        data,
        setData,
        post,
        reset,
        setDefaults,
        processing,
        errors,
        transform,
    } = useForm({
        projectTitle: "",
        projectCreator: `${auth.user.original.data.firstName} ${auth.user.original.data.lastName}`,
        milestones: [
            {
                milestoneTitle: "",
                estimateStartDate: null,
                estimateEndDate: null,
                actualStartDate: null,
                actualEndDate: null,
                images: [
                  {
                    image: null,
                    geoLocation: null
                  }
                ]
            },
        ],
    });

    const handleImageChange = (milestoneIndex, imageIndex, event) => {
      const file = event.target.files[0];
      if (file) {
        const updatedMilestones = [...data.milestones];
        updatedMilestones[milestoneIndex].images[imageIndex].image = file;

        setData(data => ({
          ...data,
          milestones: updatedMilestones
        }));
      }
    };

    const addImageToMilestone = (milestoneIndex) => {
      const updatedMilestones = [...data.milestones];
      updatedMilestones[milestoneIndex].images.push({
        image: null,
        geoLocation: null
      });

      setData(data => ({
        ...data,
        milestones: updatedMilestones
      }));
    };

    const removeImageFromMilestone = (milestoneIndex, imageIndex) => {
      const updatedMilestones = [...data.milestones];
      updatedMilestones[milestoneIndex].images.splice(imageIndex, 1);

      setData(data => ({
        ...data,
        milestones: updatedMilestones
      }));
    };

    // Add this to your renderMilestone function
    const renderMilestoneImages = (milestone, milestoneIndex) => (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h4 className="text-sm font-medium">Images</h4>
          <Button
            type="button"
            icon="pi pi-plus"
            onClick={() => addImageToMilestone(milestoneIndex)}
            outlined
            size="small"
            label="Add Image"
          >
            
          </Button>
        </div>

        {milestone.images.map((imageData, imageIndex) => (
          <div key={imageIndex} className="flex items-center space-x-4">
            <input
              type="file"
              onChange={(e) => handleImageChange(milestoneIndex, imageIndex, e)}
              accept="image/*"
              className="flex-1"
            />
            <Button
              type="button"
              icon="pi pi-trash"
              onClick={() => removeImageFromMilestone(milestoneIndex, imageIndex)}
              severity="danger"
              outlined
              size="small"
            />
          </div>
        ))}
      </div>
    );

    const handleMilestoneChange = (index, field, value) => {
      // For date fields, ensure we're sending an ISO string
      // const finalValue = value instanceof Date ? value.toISOString() : value;

      const updatedMilestones = [...data.milestones];
      updatedMilestones[index] = {
        ...updatedMilestones[index],
        [field]: value
      };

      setData(data => ({
        ...data,
        milestones: updatedMilestones
      }));
    };

    const addMilestone = () => {
        setData((data) => ({
            ...data,
            milestones: [
                ...data.milestones,
                {
                    milestoneTitle: "",
                    estimateStartDate: null,
                    estimateEndDate: null,
                    actualStartDate: null,
                    actualEndDate: null,
                    images: [
                      {
                          image: null,
                          geoLocation: null
                      }
                    ]
                },
            ],
        }));
    };

    const removeMilestone = (index) => {
        if (data.milestones.length > 1) {
            const updatedMilestones = data.milestones.filter(
                (_, i) => i !== index
            );
            setData((data) => ({
                ...data,
                milestones: updatedMilestones,
            }));
        }
    };

    const submit = (e) => {
        e.preventDefault();
        post(route("project.store"), {
            onSuccess: (response) => {
                setDefaults({
                    projectTitle: "",
                    projectCreator: `${auth.user.original.data.firstName} ${auth.user.original.data.lastName}`,
                    milestones: [
                        {
                            milestoneTitle: "",
                            estimateStartDate: null,
                            estimateEndDate: null,
                            actualStartDate: null,
                            actualEndDate: null,
                            images: [
                              {
                                  image: null,
                                  geoLocation: null
                              }
                            ]
                        },
                    ],
                });
                reset();
                setOpen(false);
            },
            onError: (errors) => {
                console.log(errors);
            },
        });
    };

    const onHandleChange = (event) => {
        const targetName = event.target.name;

        setData((data) => ({
            ...data,
            [targetName]:
                event.target.type === "checkbox"
                    ? event.target.checked
                    : event.target.value,
        }));
    };

    useEffect(() => {
        const handleResize = () => {
            setIsSmallScreen(window.innerWidth <= 767);
        };

        // Attach the event listener for window resize
        window.addEventListener("resize", handleResize);

        // Cleanup the event listener on component unmount
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    const renderMilestone = (milestone, index) => (
        <div key={index} className="space-y-4 p-4 border rounded-lg bg-gray-50">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Milestone {index + 1}</h3>
                {data.milestones.length > 1 && (
                    <Button
                        icon="pi pi-trash"
                        severity="danger"
                        outlined
                        onClick={() => removeMilestone(index)}
                        type="button"
                    />
                )}
            </div>

            <div className="space-y-4">
                <div>
                    <label htmlFor={`milestone-${index}-title`}>
                        Milestone Title <span className="text-red-500">*</span>
                    </label>
                    <InputText
                        className="w-full"
                        id={`milestone-${index}-title`}
                        value={milestone.milestoneTitle}
                        onChange={(e) =>
                            handleMilestoneChange(
                                index,
                                "milestoneTitle",
                                e.target.value
                            )
                        }
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label>Estimated Start Date</label>
                        <Calendar
                            className="w-full"
                            value={milestone.estimateStartDate}
                            onChange={(e) =>
                                handleMilestoneChange(
                                    index,
                                    "estimateStartDate",
                                    e.value
                                )
                            }
                        />
                    </div>
                    <div>
                        <label>Estimated End Date</label>
                        <Calendar
                            className="w-full"
                            value={milestone.estimateEndDate}
                            onChange={(e) =>
                                handleMilestoneChange(
                                    index,
                                    "estimateEndDate",
                                    e.value
                                )
                            }
                            minDate={milestone.estimateStartDate}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label>Actual Start Date</label>
                        <Calendar
                            className="w-full"
                            value={milestone.actualStartDate}
                            onChange={(e) =>
                                handleMilestoneChange(
                                    index,
                                    "actualStartDate",
                                    e.value
                                )
                            }
                        />
                    </div>
                    <div>
                        <label>Actual End Date</label>
                        <Calendar
                            className="w-full"
                            value={milestone.actualEndDate}
                            onChange={(e) =>
                                handleMilestoneChange(
                                    index,
                                    "actualEndDate",
                                    e.value
                                )
                            }
                            minDate={milestone.actualStartDate}
                        />
                    </div>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {renderMilestoneImages(milestone, index)}
                </div>
            </div>
        </div>
    );

    return (
        <Dialog
            visible={open}
            header={
                <React.Fragment>
                    <h1 className="text-lg font-medium leading-6 text-gray-900">
                        Add Project
                    </h1>
                </React.Fragment>
            }
            blockScroll={true}
            onHide={() => setOpen(false)}
        >
            <form onSubmit={submit} className="flex h-full flex-col">
                <div className="flex flex-1 flex-col justify-between overflow-y-scroll py-1">
                    <div className="grid grid-cols-12 gap-6">
                        <div className="col-span-12 space-y-2">
                            <div>
                                <label htmlFor="projectTitle">
                                    Project Title{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <InputText
                                    className="w-full"
                                    id="projectTitle"
                                    name="projectTitle"
                                    placeholder=""
                                    onChange={onHandleChange}
                                    value={data.projectTitle}
                                />
                                {errors.projectTitle && (
                                    <p className="mt-2 text-sm text-red-600">
                                        {errors.projectTitle}
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className="col-span-12 space-y-2">
                            <div>
                                <label htmlFor="projectCreator">
                                    Project Creator{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <InputText
                                    className="w-full"
                                    id="projectCreator"
                                    name="projectCreator"
                                    placeholder=""
                                    onChange={onHandleChange}
                                    value={data.projectCreator}
                                />
                                {errors.projectCreator && (
                                    <p className="mt-2 text-sm text-red-600">
                                        {errors.projectCreator}
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className="col-span-12  space-y-4">
                            <div className="flex justify-between items-center">
                                <h2 className="text-xl font-medium">
                                    Milestones
                                </h2>
                                <Button
                                    type="button"
                                    icon="pi pi-plus"
                                    onClick={addMilestone}
                                    outlined
                                    label="Add Milestone"
                                ></Button>
                            </div>

                            <div className="space-y-4">
                                {data.milestones.map((milestone, index) =>
                                    renderMilestone(milestone, index)
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-4 flex flex-shrink-0 justify-end pt-4 border-t border-gray-200 fixed-bottom space-x-2">
                    <Button
                        severity="secondary"
                        outlined
                        onClick={() => setOpen(false)}
                    >
                        Cancel
                    </Button>
                    <Button loading={processing} type="submit">
                        Create
                    </Button>
                </div>
            </form>
            <style jsx="true">{``}</style>
        </Dialog>
    );
}
