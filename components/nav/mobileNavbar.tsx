"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FaBars, FaTimes, FaClipboardList, FaClipboardCheck, FaTags, FaCogs, FaMapMarkedAlt } from "react-icons/fa";

export default function MobileMenuPMOC() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        className="fixed top-4 left-4 z-50 p-2 bg-gray-900 text-white rounded-full md:hidden"
        onClick={() => setOpen(!open)}
      >
        {open ? <FaTimes size={20}/> : <FaBars size={20}/>}
      </button>

      <div
        className={`
          fixed inset-0 bg-gray-200 bg-opacity-10 z-40
          transform transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:hidden
        `}
        onClick={() => setOpen(false)}
      />

      <nav
        className={`
          fixed top-0 left-0 h-full w-64 bg-gray-900 text-gray-200 z-50
          transform transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:hidden
        `}
      >
        <ul className="mt-20 space-y-4 p-4">
          <li>
            <Link href="/pmoc-form" onClick={() => setOpen(false)} className="flex items-center space-x-3 hover:text-white">
              <FaClipboardList /> <span>Formulário</span>
            </Link>
          </li>
          <li>
            <Link href="/pmoc-list" onClick={() => setOpen(false)} className="flex items-center space-x-3 hover:text-white">
              <FaClipboardCheck /> <span>Listagem</span>
            </Link>
          </li>
          <li>
            <Link href="/tags" onClick={() => setOpen(false)} className="flex items-center space-x-3 hover:text-white">
              <FaTags /> <span>Tags</span>
            </Link>
          </li>
          <li>
            <Link href="/servicos" onClick={() => setOpen(false)} className="flex items-center space-x-3 hover:text-white">
              <FaCogs /> <span>Serviços</span>
            </Link>
          </li>
          <li>
            <Link href="/ambientes" onClick={() => setOpen(false)} className="flex items-center space-x-3 hover:text-white">
              <FaMapMarkedAlt /> <span>Ambientes</span>
            </Link>
          </li>
          <li className="mt-6">
            <button
              onClick={() => {
                localStorage.removeItem("pmoc_auth");
                window.location.href = "/";
              }}
              className="w-full text-left text-red-500 hover:text-red-300"
            >
              Sair
            </button>
          </li>
        </ul>
      </nav>
    </>
  );
}
