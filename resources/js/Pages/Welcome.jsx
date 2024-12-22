
import { Link, Head } from "@inertiajs/react";

export default function Welcome({ auth, laravelVersion, phpVersion }) {
  return (
    <div>
      <Head title="Welcome" />
      <h1>Welcome to Laravel Inertia React</h1>
    </div>
  )
}