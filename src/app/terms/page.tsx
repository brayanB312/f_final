"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function LegalPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("terminos")

  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">Términos y Política de Privacidad</h1>

        <div className="flex border-b mb-8">
          <button
            className={`py-2 px-4 font-medium ${activeTab === "terminos" ? "border-b-2 border-primary text-primary" : "text-muted-foreground"}`}
            onClick={() => setActiveTab("terminos")}
          >
            Términos de Servicio
          </button>
          <button
            className={`py-2 px-4 font-medium ${activeTab === "privacidad" ? "border-b-2 border-primary text-primary" : "text-muted-foreground"}`}
            onClick={() => setActiveTab("privacidad")}
          >
            Política de Privacidad
          </button>
        </div>

        {activeTab === "terminos" && (
          <div className="border rounded-lg p-6 space-y-6 mb-6">
            <div className="space-y-2 mb-6">
              <h2 className="text-2xl font-bold">Términos de Servicio</h2>
              <p className="text-muted-foreground">
                Última actualización:{" "}
                {new Date().toLocaleDateString("es-ES", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>

            <section>
              <h3 className="text-xl font-semibold mb-3">1. Aceptación de los Términos</h3>
              <p className="text-muted-foreground">
                Al acceder y utilizar este sitio web, usted acepta estar sujeto a estos Términos de Servicio, todas
                las leyes y regulaciones aplicables, y acepta que es responsable del cumplimiento de las leyes
                locales aplicables. Si no está de acuerdo con alguno de estos términos, tiene prohibido utilizar o
                acceder a este sitio.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-3">2. Licencia de Uso</h3>
              <p className="text-muted-foreground">
                Se concede permiso para descargar temporalmente una copia de los materiales en el sitio web para
                visualización transitoria personal, no comercial. Esta es la concesión de una licencia, no una
                transferencia de título, y bajo esta licencia usted no puede:
              </p>
              <ul className="list-disc pl-6 mt-2 text-muted-foreground">
                <li>Modificar o copiar los materiales;</li>
                <li>Usar los materiales para cualquier propósito comercial o para exhibición pública;</li>
                <li>
                  Intentar descompilar o aplicar ingeniería inversa a cualquier software contenido en el sitio web;
                </li>
                <li>Eliminar cualquier copyright u otras notaciones de propiedad de los materiales; o</li>
                <li>
                  Transferir los materiales a otra persona o "reflejar" los materiales en cualquier otro servidor.
                </li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-3">3. Limitación de Responsabilidad</h3>
              <p className="text-muted-foreground">
                En ningún caso la empresa o sus proveedores serán responsables por daños (incluyendo, sin
                limitación, daños por pérdida de datos o beneficios, o debido a la interrupción del negocio) que
                surjan del uso o la incapacidad de usar los materiales en el sitio web, incluso si la empresa o un
                representante autorizado ha sido notificado oralmente o por escrito de la posibilidad de tales
                daños.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-3">4. Precisión de los Materiales</h3>
              <p className="text-muted-foreground">
                Los materiales que aparecen en el sitio web podrían incluir errores técnicos, tipográficos o
                fotográficos. La empresa no garantiza que cualquiera de los materiales en su sitio web sea preciso,
                completo o actual. La empresa puede realizar cambios a los materiales contenidos en su sitio web en
                cualquier momento sin previo aviso.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-3">5. Enlaces</h3>
              <p className="text-muted-foreground">
                La empresa no ha revisado todos los sitios enlazados a su sitio web y no es responsable por el
                contenido de ningún sitio enlazado. La inclusión de cualquier enlace no implica respaldo por parte
                de la empresa del sitio. El uso de cualquier sitio web enlazado es bajo el propio riesgo del
                usuario.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-3">6. Modificaciones</h3>
              <p className="text-muted-foreground">
                La empresa puede revisar estos términos de servicio para su sitio web en cualquier momento sin
                previo aviso. Al usar este sitio web, usted acepta estar sujeto a la versión actual de estos
                términos de servicio.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-3">7. Ley Aplicable</h3>
              <p className="text-muted-foreground">
                Estos términos y condiciones se rigen e interpretan de acuerdo con las leyes y usted se somete
                irrevocablemente a la jurisdicción exclusiva de los tribunales en esa ubicación.
              </p>
            </section>
          </div>
        )}

        {activeTab === "privacidad" && (
          <div className="border rounded-lg p-6 space-y-6 mb-6">
            <div className="space-y-2 mb-6">
              <h2 className="text-2xl font-bold">Política de Privacidad</h2>
              <p className="text-muted-foreground">
                Última actualización:{" "}
                {new Date().toLocaleDateString("es-ES", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>

            <section>
              <h3 className="text-xl font-semibold mb-3">1. Información que Recopilamos</h3>
              <p className="text-muted-foreground">
                Podemos recopilar información personal que usted nos proporciona directamente, como su nombre,
                dirección de correo electrónico, número de teléfono, y cualquier otra información que elija
                proporcionar.
              </p>
              <p className="text-muted-foreground mt-2">
                También recopilamos automáticamente cierta información cuando visita nuestro sitio web, incluyendo:
              </p>
              <ul className="list-disc pl-6 mt-2 text-muted-foreground">
                <li>
                  Información de registro, como su dirección IP, tipo de navegador, proveedor de servicios de
                  Internet, páginas de referencia/salida, sistema operativo;
                </li>
                <li>
                  Información sobre su visita, incluyendo las páginas que visita, el tiempo que pasa en esas
                  páginas, etc.
                </li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-3">2. Cómo Utilizamos Su Información</h3>
              <p className="text-muted-foreground">Utilizamos la información que recopilamos para:</p>
              <ul className="list-disc pl-6 mt-2 text-muted-foreground">
                <li>Proporcionar, mantener y mejorar nuestros servicios;</li>
                <li>Procesar transacciones y enviar notificaciones relacionadas;</li>
                <li>
                  Enviar información técnica, actualizaciones, alertas de seguridad y mensajes de soporte y
                  administrativos;
                </li>
                <li>Responder a sus comentarios, preguntas y solicitudes;</li>
                <li>
                  Comunicarnos con usted sobre productos, servicios, ofertas, promociones, y eventos, y proporcionar
                  otras noticias o información sobre nosotros;
                </li>
                <li>Monitorear y analizar tendencias, uso y actividades en relación con nuestros servicios;</li>
                <li>
                  Detectar, investigar y prevenir transacciones fraudulentas y otras actividades ilegales y proteger
                  los derechos y la propiedad de la empresa y otros.
                </li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-3">3. Compartición de Información</h3>
              <p className="text-muted-foreground">
                Podemos compartir la información que recopilamos de la siguiente manera:
              </p>
              <ul className="list-disc pl-6 mt-2 text-muted-foreground">
                <li>
                  Con proveedores, consultores y otros proveedores de servicios que necesitan acceso a dicha
                  información para llevar a cabo trabajo en nuestro nombre;
                </li>
                <li>
                  En respuesta a una solicitud de información si creemos que la divulgación está de acuerdo con, o
                  es requerida por, cualquier ley aplicable, regulación o proceso legal;
                </li>
                <li>
                  Si creemos que sus acciones son inconsistentes con nuestros acuerdos o políticas, o para proteger
                  los derechos, la propiedad y la seguridad de la empresa o de otros;
                </li>
                <li>
                  En conexión con, o durante las negociaciones de, cualquier fusión, venta de activos de la empresa,
                  financiamiento o adquisición de todo o una parte de nuestro negocio por otra empresa;
                </li>
                <li>Con su consentimiento o bajo su dirección.</li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-3">4. Seguridad</h3>
              <p className="text-muted-foreground">
                Tomamos medidas razonables para ayudar a proteger la información personal que recopilamos sobre
                usted de pérdida, robo, uso indebido y acceso no autorizado, divulgación, alteración y destrucción.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-3">5. Sus Derechos</h3>
              <p className="text-muted-foreground">
                Dependiendo de su ubicación, puede tener ciertos derechos con respecto a su información personal,
                como el derecho a solicitar acceso, corrección, actualización o eliminación de su información, o a
                oponerse a nuestro procesamiento de su información.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-3">6. Cambios a esta Política de Privacidad</h3>
              <p className="text-muted-foreground">
                Podemos cambiar esta Política de Privacidad de vez en cuando. Si hacemos cambios, le notificaremos
                revisando la fecha en la parte superior de la política y, en algunos casos, podemos proporcionarle
                un aviso adicional (como agregar una declaración a nuestra página de inicio o enviarle una
                notificación).
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-3">7. Contáctenos</h3>
              <p className="text-muted-foreground">
                Si tiene alguna pregunta sobre esta Política de Privacidad, por favor contáctenos a: [correo
                electrónico de contacto].
              </p>
            </section>
          </div>
        )}

        <div className="flex justify-center">
          <button
            className="px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            onClick={() => router.push("/sign-in")}
          >
            Regresar al registro
          </button>
        </div>
      </div>
    </div>
  )
}