"use client";
import { Title } from "@/components/title-menu";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { AlertPopup } from "@/components/Alert";
import { newProperty } from "@/app/api/callApi";
import { CldUploadWidget } from "next-cloudinary";
import Autocomplete from "@/components/ui/Autocomplete";

const tags = [
  {
    id: "beachfront",
    label: "Playa en frente",
  },
  {
    id: "wifi",
    label: "Wifi",
  },
  {
    id: "pets allowed",
    label: "Se permiten mascotas",
  },
  {
    id: "pool",
    label: "Piscina",
  },
  {
    id: "with furniture",
    label: "Amueblada",
  },
  {
    id: "Smoking is allowed",
    label: "Se permite fumar",
  },
  {
    id: "private parking",
    label: "Estacionamiento Privado",
  },
  {
    id: "workspace",
    label: "Espacio de trabajo",
  },
];

const fileSchema = z
  .instanceof(File)
  .refine((file) => ["image/jpeg", "image/png"].includes(file.type), {
    message: "El archivo debe ser un JPEG o PNG",
  });

const formSchema = z.object({
  title: z.string().min(4, {
    message: "Selecciona una opcion",
  }),
  description: z
    .string()
    .min(10, { message: "muy corta la descripcion" })
    .max(300, { message: "no debe superar los 300 caracteres" }),
  price: z.string(),
  max_people: z.string(),
  tags: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "selecciona al menos un item",
  }),
  pais: z.string().optional(),
  provincia: z.string().optional(),
  ciudad: z.string().optional(),
  calle: z.string().optional(),
  photos: z.array(fileSchema).optional(),
});

export default function RegisterProperty() {
  const [resource, setResource] = useState();
  const [files, setFiles] = useState([]);
  const [alert, setAlert] = useState({ show: false, message: "", type: "" });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      price: "0",
      max_people: "1",
      tags: ["wifi"],
      pais: "",
      provincia: "",
      ciudad: "",
      calle: "",
      photos: [],
    },
  });

  /*const handleInputChange = (event) => {
    event.preventDefault();
    let filesInput = Array.from(event.target.files);
    setFiles(filesInput);
    form.setValue("photos", filesInput);
  };*/

  function onSubmit(values, event) {
    event.preventDefault();
    //valido los datos ingresado con safeParse y me dice si se cargo correctamente
    const validationResult = formSchema.safeParse(values);
    if (!validationResult.success) {
      console.log(values);
      console.error(validationResult.error);
      setAlert({
        show: true,
        message: "error al validar los datos",
        type: "error",
      });
    } else {
      console.log(values);
      console.log("Form submitted successfully!", validationResult.data);
      const response = newProperty(values);
      response.then((result) => {
        //console.log('Resultado:', result);
        if (result.message === "Registro exitoso") {
          setAlert(result);
          //setTimeout(() => router.push("/auth/login"), 10000);
        }
        setAlert(result);
      });
    }
    setTimeout(() => setAlert({ show: false, message: "", type: "" }), 10000);
  }

  const handleSelect = (location) => {
    console.log(`Latitud: ${location.lat}, Longitud: ${location.lon}`);
  };

  return (
    <div className="mx-auto">
      <Title
        title="Agregar nueva propiedad"
        description="Agrega, edita o elimina tus publicaciones."
      />
      {alert.show && <AlertPopup message={alert.message} type={alert.type} />}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-1 bg-color_form_background rounded-md p-5"
        >
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de inmueble</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Elegir" {...field} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="casa">casa</SelectItem>
                    <SelectItem value="departamento">departamento</SelectItem>
                    <SelectItem value="habitacion">habitacion</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control.description}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descripcion</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Ingrese una breve descripcion de la casa"
                    className="bg-white"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Breve descripcion que capte la atención.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control.price}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Precio</FormLabel>
                <FormControl>
                  <Input
                    className="bg-white"
                    type="text"
                    pattern="\d*"
                    minLength="1"
                    maxLength="10"
                    title="Por favor, ingresa solo números enteros."
                    placeholder="Ingrese el precio del alquiler"
                    {...field}
                  />
                </FormControl>
                <FormDescription>Precio del alquiler por dia</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control.max_people}
            name="max_people"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Personas</FormLabel>
                <FormControl>
                  <Input
                    className="bg-white"
                    type="text"
                    pattern="^[1-9][0-9]{0,2}$"
                    minLength="1"
                    maxLength="3"
                    title="Por favor, ingresa solo números enteros desde el 1"
                    placeholder="Ingrese las personar admitidas"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Personas que entran en el alquiler
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control.tags}
            name="tags"
            render={() => (
              <FormItem>
                <div className="mb-4">
                  <FormLabel>Detalles</FormLabel>
                  <FormDescription>
                    Seleciona uno o varios items que detallen tu propiedad.
                  </FormDescription>
                </div>
                <div className="flex flex-row flex-wrap">
                  {tags.map((tag) => (
                    <FormField
                      key={tag.id}
                      control={form.control.tags}
                      name="tags"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={tag.id}
                            className="flex flex-row items-start space-x-3 space-y-0 m-1"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(tag.id)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...field.value, tag.id])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== tag.id
                                        )
                                      );
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {tag.label}
                            </FormLabel>
                          </FormItem>
                        );
                      }}
                    />
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dirección (autocompletado)</FormLabel>
                <FormControl>
                  <Autocomplete onSelect={handleSelect} />
                </FormControl>
              </FormItem>
            )}
          />
          {/* <FormField
            control={form.control.pais}
            name="pais"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dirreccion</FormLabel>
                <FormControl>
                  <Input className="bg-white" placeholder="País" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control.pais}
            name="provincia"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    className="bg-white"
                    placeholder="Provincia"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control.ciudad}
            name="ciudad"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input className="bg-white" placeholder="Ciudad" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control.calle}
            name="calle"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    className="bg-white"
                    placeholder="Dirección (calle y numeración)"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          /> */}
          {/*<FormField
            control={form.control}
            name="photos"
            render={() => (
              <FormItem>
                <FormLabel>Agregar fotos de la propiedad</FormLabel>
                <FormDescription>
                  Puedes subir hasta 20 archivos formato imagen .jpg o .png.
                </FormDescription>
                <FormControl>
                  <Input
                    type="file"
                    multiple
                    accept="image/png, image/jpeg"
                    onChange={handleInputChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />*/}
          <FormLabel>Agregar fotos de la propiedad</FormLabel>
          <FormDescription>
            Puedes subir hasta 20 archivos formato imagen .jpg o .png.
          </FormDescription>
          <CldUploadWidget
            signatureEndpoint="/api/cloudinary"
            onSuccess={(result, { widget }) => {
              setResource(result?.info);
              setFiles(...files, result.info.url);
              console.log(files);
            }}
            onQueuesEnd={(result, { widget }) => {
              widget.close();
            }}
          >
            {({ open }) => {
              return (
                <button
                  className="bg-color_form_button text-white mt-5 rounded-md py-2 px-4"
                  onClick={() => open()}
                >
                  Agregar fotos
                </button>
              );
            }}
          </CldUploadWidget>
          <div className="flex justify-end w-[90%]">
            <Button
              className="bg-color_form_button text-white mt-5"
              type="submit"
            >
              Cargar propiedad
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
