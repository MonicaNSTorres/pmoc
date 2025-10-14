"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FaClipboardList, FaCogs, FaTags, FaMapMarkedAlt, FaClipboardCheck, FaBars, FaFolderOpen, FaPlusCircle, FaRunning } from "react-icons/fa";
import { useRouter, usePathname } from "next/navigation";
import ModalNovoUsuario from "../pmoc-modal-new-user/pmoc-modal-new-user";

const SidebarPMOC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const auth = localStorage.getItem("pmoc_auth");
    if (auth) {
      try {
        const parsed = JSON.parse(auth);
        setIsAdmin(parsed.admin === true);
      } catch {
        setIsAdmin(false);
      }
    }
  }, []);

  if (!isClient) return null;

  const toggleSidebar = () => setIsOpen(!isOpen);
  const closeSidebar = () => setIsOpen(false);

  const isActive = (path: string) => pathname === path ? "bg-blue-600 text-white" : "text-gray-400";

  return (
    <div className={`${isOpen ? "w-64" : "w-20"} bg-gray-900 text-gray-400 flex flex-col transition-all duration-300 h-screen fixed`}>
      <div className="flex justify-center items-center p-4">
        {/*{isOpen ? (
          <div className={`${styles.logo} flex justify-center`} />
        ) : (
          <div className={`${styles.logoIcon} flex justify-center`} />
        )}*/}
      </div>
      <button onClick={toggleSidebar} className="flex items-center justify-center h-14 hover:cursor-pointer">
        {isOpen ? "Menu" : <FaBars size={20} color="#9B9B9B" />}
      </button>
      <ul className="flex-1 space-y-4 p-4">
        <li>
          <Link
            href="/pmoc-form"
            onClick={closeSidebar}
            className={`flex items-center space-x-4 p-3 rounded-md transition-colors duration-200 hover:text-white ${isActive("/pmoc-form")}`}
          >
            <FaClipboardList className="text-2xl" />
            {isOpen && <span>Formulário PMOC</span>}
          </Link>
        </li>
        <li>
          <Link
            href="/pmoc-list"
            onClick={closeSidebar}
            className={`flex items-center space-x-4 p-3 rounded-md transition-colors duration-200 hover:text-white ${isActive("/pmoc-list")}`}
          >
            <FaClipboardCheck className="text-2xl" />
            {isOpen && <span>Listagem PMOC</span>}
          </Link>
        </li>
        <li>
          <Link
            href="/pmoc-pdf"
            onClick={closeSidebar}
            className={`flex items-center space-x-4 p-3 rounded-md transition-colors duration-200 hover:text-white ${isActive("/pmoc-pdf")}`}
          >
            <FaFolderOpen className="text-2xl" />
            {isOpen && <span>PDF's Gerados</span>}
          </Link>
        </li>
        <li>
          <Link
            href="/tags"
            onClick={closeSidebar}
            className={`flex items-center space-x-4 p-3 rounded-md transition-colors duration-200 hover:text-white ${isActive("/tags")}`}
          >
            <FaTags className="text-2xl" />
            {isOpen && <span>Tags</span>}
          </Link>
        </li>
        <li>
          <Link
            href="/servicos"
            onClick={closeSidebar}
            className={`flex items-center space-x-4 p-3 rounded-md transition-colors duration-200 hover:text-white ${isActive("/servicos")}`}
          >
            <FaCogs className="text-2xl" />
            {isOpen && <span>Serviços</span>}
          </Link>
        </li>
        <li>
          <Link
            href="/ambientes"
            onClick={closeSidebar}
            className={`flex items-center space-x-4 p-3 rounded-md transition-colors duration-200 hover:text-white ${isActive("/ambientes")}`}
          >
            <FaMapMarkedAlt className="text-2xl" />
            {isOpen && <span>Ambientes</span>}
          </Link>
        </li>
        <li>
          <button
            onClick={() => {
              localStorage.removeItem("pmoc_auth");
              window.location.href = "/";
            }}
            className="flex items-center justify-center w-full bg-red-700 text-white px-3 py-2 rounded hover:bg-red-600 cursor-pointer"
          >
            <FaRunning className={`text-2xl transition-all ${isOpen ? "mr-1" : "mx-auto"}`} />
            {isOpen && <span>Sair</span>}
          </button>
        </li>

        {isAdmin && (
          <li>
            <button
              onClick={() => {
                closeSidebar();
                setMostrarModal(true);
              }}
              className="flex items-center justify-center w-full bg-green-700 text-white px-3 py-2 rounded hover:bg-green-600 cursor-pointer"
            >
              <FaPlusCircle className={`text-2xl transition-all ${isOpen ? "mr-1" : "mx-auto"}`} />
              {isOpen && <span>Cadastrar usuário</span>}
            </button>

            {mostrarModal && (
              <ModalNovoUsuario onClose={() => setMostrarModal(false)} />
            )}
          </li>
        )}

      </ul>
    </div>
  );
};

export default SidebarPMOC;