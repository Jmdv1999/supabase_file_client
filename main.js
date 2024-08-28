import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import 'dotenv/config'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

async function uploadFile(carpeta, archivo,nombrearchivo) {
  const file = fs.readFileSync(archivo);
  const { data, error } = await supabase.storage
    .from("Vouchers")
    .upload(carpeta+"/"+fecha()+nombrearchivo+".txt", file);

  if (error) {
    console.error("Error al subir el archivo:", error);
  } else {
    console.log("Archivo subido con éxito:", data);
  }
}

async function listFiles() {
  const { data, error } = await supabase.storage
    .from("Vouchers")
    .list("", { limit: 100, offset: 0 });

  if (error) {
    console.error("Error al listar los archivos:", error);
  } else {
    console.log("Archivos en el bucket:", data);
  }
}

async function downloadFile(fileName) {
  const { data, error } = await supabase.storage
    .from("Vouchers")
    .download(fileName);

  if (error) {
    console.error("Error al descargar el archivo:", error);
  } else {
    const filePath = `Ruta a descargar`;
    fs.writeFileSync(filePath, Buffer.from(await data.arrayBuffer()));
    console.log(`Archivo descargado con éxito: ${filePath}`);
  }
}
//downloadFile("archivo.pdf");
//listFiles();
//uploadFile();

function fecha() {
  const fecha = new Date();

  const dia = fecha.getDate().toString().padStart(2, "0"); // Día del mes (1-31)
  const mes = (fecha.getMonth() + 1).toString().padStart(2, "0"); // Mes (0-11, por eso se suma 1)
  const year = fecha.getFullYear().toString(); // Año completo (por ejemplo, 2024)

  const codigoUnico = `${dia}${mes}${year}`;
  return codigoUnico;
}
