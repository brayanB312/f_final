"use client";

import Navbar from "@/components/navbarMainPage";
import "@/app/globals.css"; 

export default function Home() {
  return (
    <>

      <Navbar />

    <section id="main_section" className="relative bg-white text-black py-20 px-6 flex flex-col items-center text-center">
      </section>

      <section id="main_section" className="relative bg-white text-black py-20 px-6 flex flex-col items-center text-center">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight text-black">Bienvenido a FamilyShare</h1>
          <p className="mt-4 text-lg md:text-xl text-gray-800">Almacena, organiza y accede de manera segura a tus documentos oficiales en un solo lugar</p>
          <div className="mt-6 flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-4">
            <a href="/sign-in" className="no-underline bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-5 rounded-lg text-lg font-medium transition">Crea un cuenta</a>
            <a href="/login" className="no-underline border border-gray-900 py-2.5 px-5 rounded-lg text-lg font-medium hover:bg-zinc-200 hover:text-gray-900 transition">Iniciar sesion</a>
          </div>
        </div>
      </section>

      <section className="relative bg-white text-black py-20 px-6 flex flex-col items-center text-center">
        <div className="max-w-4xl w-full rounded overflow-hidden shadow-sm flex flex-col md:flex-row">

          <div className="w-full md:w-1/2 p-4 flex flex-col items-center justify-center">
            <h2 className="text-3xl md:text-4xl font-semibold mb-2 text-center">Todos tus documentos en un solo lugar</h2>
            <p className="text-lg md:text-xl text-gray-700 text-center">Almacena tus documentos y accede a ellos desde donde sea.</p>
          </div>
          <div className="w-full md:w-1/2">
            <img className="w-full h-[300px] md:h-full object-fit" src="/docs.avif" alt="Imagen de la Card" />
          </div>

        </div>
      </section>

      <section className="relative bg-white text-black py-24 px-6 flex flex-col items-center text-center">
        <div className="max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-semibold mb-6">
            Almacenamiento en la nube seguro con el que puedes contar
          </h2>
          <p className="text-lg md:text-xl text-gray-700">
            Conserva tus datos en la infraestructura confiable de FamilyShare, que se integra a la perfección en tus apps de Workspace.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-12 mt-12 max-w-6xl">
          <div className="flex-1 text-center">
            <img src="/nube2.webp" alt="Nativo de la nube" className="mx-auto mb-8" />
            <h3 className="text-xl font-semibold">Nativo de la nube</h3>
            <p className="text-gray-700">
              Un enfoque centrado en la nube y basado en el navegador que se actualiza constantemente sin tener que instalar nada.
            </p>
          </div>

          <div className="flex-1 text-center">
            <img src="/aarquitecturaweb.jpeg" alt="Arquitectura de confianza cero" className="mx-auto mb-8" />
            <h3 className="text-xl font-semibold">Arquitectura de confiable</h3>
            <p className="text-gray-700">
              Tus datos valiosos se protegen con funciones de seguridad sólidas, como la encriptación del cliente y Vault, con un enfoque de confiabilidad.
            </p>
          </div>

          <div className="flex-1 text-center">
            <img src="/certify.avif" alt="Certificación en tus archivos" className="mx-auto mb-8" />
            <h3 className="text-xl font-semibold">Certificación en tus archivos</h3>
            <p className="text-gray-700">
              Ofrecemos confianza en la validación de tus archivos comprometiéndonos a que tus documentos sean legales con una verificación.
            </p>
          </div>
        </div>
      </section>    
    </>
  );
}
