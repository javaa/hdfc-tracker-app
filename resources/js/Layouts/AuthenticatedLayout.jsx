import React, { useRef, useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Menu } from "primereact/menu";
import { Button } from "primereact/button";
import { Sidebar } from 'primereact/sidebar';
import { Ripple } from 'primereact/ripple';
import { StyleClass } from 'primereact/styleclass';
import FlashMessages from '../Components/FlashMessages';

export default function AuthenticatedLayout({ children }) {
  const { auth } = usePage().props;
  const menuRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);

  const menuItems = [
    // {
    //     label: "Profile",
    //     icon: "pi pi-user",
    //     command: () => {
    //         // Handle profile click
    //         // window.location.href = '/profile/edit'; // Replace with your actual profile edit route
    //         router.get(route("profile.edit"));
    //     },
    // },
    {
        label: "Logout",
        icon: "pi pi-sign-out",
        command: () => {
            router.post(
                route("logout"),
                {},
                {
                    preserveState: false,
                    preserveScroll: false,
                }
            );
        },
    },
];

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar visible={visible} onHide={() => setVisible(false)}>
        <ul className="list-none p-0 m-0 overflow-hidden flex flex-col h-full">
          <div className='flex-grow-1'>
          {/* <li>
          <a href={route('dashboard')} className={`p-ripple flex items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full ${route().current('dashboard') == true ? 'bg-gray-100' : ''}`}>
              <i className="pi pi-chart-line mr-2"></i>
              <span className="font-medium">Dashboard</span>
              <Ripple />
            </a>
          </li> */}
          <li>
          <a href={route('project.index')} className={`p-ripple flex items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full ${route().current('project.index') == true ? 'bg-gray-100' : ''}`}>
              <i className="pi pi-chart-line mr-2"></i>
              <span className="font-medium">Projects</span>
              <Ripple />
            </a>
          </li>
        </div>
        <li className="mt-auto">
            <Link href={route('logout')} method="post" as="button" className="p-component pi-button flex items-center cursor-pointer p-3 border-round text-700 hover:bg-gray-100 transition-duration-150 transition-colors w-full">
              <i className="pi pi-sign-out mr-2"></i>
              <span className="font-medium">Logout</span>
              <Ripple />
            </Link>
          </li>
          </ul>
          </Sidebar>
      <div className="w-full bg-gray-50">
      <div className="bg-white flex items-center justify-between justify-center gap-2 py-2 px-4 border-b sticky top-0 z-10">
            <div className="flex-none md:w-[28rem] flex gap-2 items-center">
                <Button
                    onClick={setVisible}
                    severity="secondary"
                    text
                    icon="pi pi-bars"
                />
                {/* <Link href="/">
                    <ApplicationLogo className="w-10 h-10 fill-current text-gray-500" />
                </Link> */}
                <div className="font-black text-gray-500">HDFC Project Tracker</div>
            </div>
            <div className="flex-none flex items-center">
                <button
                    onClick={(event) => menuRef.current.toggle(event)}
                    className="w-full p-link flex items-center p-1 pl-4 text-color hover:surface-200 border-noround"
                    aria-controls="popup_menu_right"
                    aria-haspopup="true"
                    aria-expanded={menuVisible} // Add aria-expanded for better accessibility
                >
                    {/* User Initials */}
                    <div className="rounded-full bg-indigo-100 py-2 px-2 mr-1 text-sm">
                        {auth.user.original.data.firstName.charAt(0)}{auth.user.original.data.lastName.charAt(0)}
                    </div>

                    {/* Dropdown Icon */}
                    <div className="flex items-center">
                        <i className="p-component p-button p-button-sm p-button-text text-gray-500 text-sm pi pi-chevron-down"></i>
                    </div>
                </button>
                <Menu
                    ref={menuRef}
                    model={menuItems}
                    onHide={() => setMenuVisible(false)}
                    popup
                />
            </div>
        </div>
        <FlashMessages />
        <div className='container mx-auto'>
          {children}
        </div>
      </div>
    </div>
  );
}