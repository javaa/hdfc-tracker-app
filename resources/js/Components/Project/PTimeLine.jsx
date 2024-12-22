import React from 'react';
import { Timeline } from 'primereact/timeline';

const PTimeline = ({ milestones }) => {
    const events = milestones.map((milestone, index) => ({
        status: milestone.milestoneTitle,
        date: milestone.actualEndDate || milestone.estimateEndDate,
        color: milestone.actualEndDate ? 'green' : 'red', // Color based on completion
    }));

    return (
        <Timeline value={events} align="alternate">
            {events.map((event, index) => (
                <Timeline.Item key={index} color={event.color}>
                    <h6>{event.status}</h6>
                    {/* <small>{event.date}</small> */}
                </Timeline.Item>
            ))}
        </Timeline>
    );
};

export default PTimeline;