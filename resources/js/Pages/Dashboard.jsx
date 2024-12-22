import { router, usePage, Link } from "@inertiajs/react";
import AuthenticatedLayout from "../Layouts/AuthenticatedLayout";
import { Head } from '@inertiajs/react';

export default function Dashboard() {
  const { auth } = usePage().props;
  return (
    <AuthenticatedLayout>
      <Head title="Dashboard" />
      <div className="p-6 min-h-screen max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        <p>{JSON.stringify(auth)}</p>
      </div>
    </AuthenticatedLayout>
  );
}