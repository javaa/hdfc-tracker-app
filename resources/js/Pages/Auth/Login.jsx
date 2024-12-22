import { Head, Link, useForm } from "@inertiajs/react";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";

export default function Login({ status }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
    });

    const submit = (e) => {
        e.preventDefault();

        post(route("login"), {
            onFinish: () => reset("password"),
        });
    };

    const onHandleChange = (event) => {
        setData((data) => ({
            ...data,
            [event.target.name]:
                event.target.type === "checkbox"
                    ? event.target.checked
                    : event.target.value,
        }));
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <Head title="Log in" />
            {status && (
                <div className="mb-4 font-medium text-sm text-green-600">
                    {status}
                </div>
            )}

            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
                <div>
                    <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
                        Login to HDFC Project Tracker App
                    </h3>
                </div>
                <form onSubmit={submit} className="space-y-6">
                    <div className="space-y-2">
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Email*
                        </label>
                        <InputText
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            onChange={onHandleChange}
                            required
                            className="w-full rounded-md"
                        />
                    </div>

                    <div className="space-y-2">
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Password*
                        </label>
                        <Password
                            value={data.password}
                            id="password"
                            onChange={onHandleChange}
                            feedback={false}
                            className="w-full"
                            inputClassName="w-full rounded-md"
                            required
                            name="password"
                        />
                    </div>

                    <div className="pt-4">
                        <Button
                            label="Login"
                            loading={processing}
                            loadingIcon="pi pi-spin pi-sun"
                            className="w-full p-3 text-base font-medium rounded-md shadow-sm"
                        />
                    </div>
                </form>
            </div>
        </div>
    );
}
