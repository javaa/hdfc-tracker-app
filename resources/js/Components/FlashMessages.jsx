import React, { useRef, useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import { Toast } from 'primereact/toast';

export default function FlashMessages() {
    const toast = useRef(null);
    const { flash, errors } = usePage().props;
    const numOfErrors = Object.keys(errors).length;

    useEffect(() => {
        if (toast.current) {
            toast.current.clear();

            if (flash.success) {
                toast.current.show({
                    severity: 'success',
                    summary: 'Success',
                    detail: flash.success,
                    life: 3000,
                });
            }

            if (flash.error || numOfErrors > 0) {
                toast.current.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: flash.error || `There ${numOfErrors === 1 ? 'is' : 'are'} ${numOfErrors} form error${numOfErrors === 1 ? '' : 's'}.`,
                    life: 3000,
                });
            }
        }
    }, [flash, errors]);

    return <Toast ref={toast} />;
}