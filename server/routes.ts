import type { Express } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import sharp from "sharp";
import { storage } from "./storage";
import { insertProjectSchema } from "../shared/schema";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";
import path from "path";
import fs from "fs";
import retellRoutes from "./retellController";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (allowedTypes.includes(file.mimetype)) cb(null, true);
    else cb(new Error("Tipo de ficheiro não suportado. Use JPG, PNG ou WEBP."));
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Diretórios estáticos
  const uploadsDir = path.join(process.cwd(), "uploads");
  if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

  const serverAssetsDir = path.join(process.cwd(), "server", "generated_images");

  // Endpoints de dados
  app.get("/api/furniture", async (_req, res) => {
    try {
      const furniture = await storage.getFurniture();
      res.json(furniture);
    } catch (error) {
      console.error("Error fetching furniture:", error);
      res.status(500).json({ error: "Erro ao carregar móveis" });
    }
  });

  app.get("/api/projects", async (_req, res) => {
    try {
      const projects = await storage.getProjects();
      res.json(projects);
    } catch (error) {
      console.error("Error fetching projects:", error);
      res.status(500).json({ error: "Erro ao carregar projetos" });
    }
  });

  app.get("/api/projects/:id", async (req, res) => {
    try {
      const project = await storage.getProject(req.params.id);
      if (!project) return res.status(404).json({ error: "Projeto não encontrado" });
      res.json(project);
    } catch (error) {
      console.error("Error fetching project:", error);
      res.status(500).json({ error: "Erro ao carregar projeto" });
    }
  });

  app.post("/api/projects", async (req, res) => {
    try {
      const result = insertProjectSchema.safeParse(req.body);
      if (!result.success) {
        const validationError = fromZodError(result.error);
        return res.status(400).json({ error: validationError.message });
      }
      const project = await storage.createProject(result.data);
      res.status(201).json(project);
    } catch (error) {
      console.error("Error creating project:", error);
      res.status(500).json({ error: "Erro ao criar projeto" });
    }
  });

  // Upload de imagem da sala
  app.post("/api/upload", upload.single("image"), async (req, res) => {
    try {
      if (!req.file) return res.status(400).json({ error: "Nenhum ficheiro enviado" });

      const filename = `room-${Date.now()}.webp`;
      const filepath = path.join(uploadsDir, filename);

      await sharp(req.file.buffer)
        .resize(1920, 1080, { fit: "inside", withoutEnlargement: true })
        .webp({ quality: 85 })
        .toFile(filepath);

      const imageUrl = `/uploads/${filename}`;
      res.json({ imageUrl });
    } catch (error) {
      console.error("Error uploading image:", error);
      res.status(500).json({ error: "Erro ao fazer upload da imagem" });
    }
  });

  // Serving estático de uploads
  app.use("/uploads", (req, res, next) => {
    res.setHeader("Cache-Control", "public, max-age=31536000");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    next();
  });
  app.use("/uploads", async (req, res, next) => {
    const cleanPath = req.path.replace(/^\//, "");
    const filePath = path.join(uploadsDir, cleanPath);
    if (fs.existsSync(filePath)) res.sendFile(filePath);
    else next();
  });

  // Compatibilidade com caminhos antigos: /attached_assets/generated_images/<ficheiro>
  app.use("/attached_assets/generated_images", (req, res, next) => {
    res.setHeader("Cache-Control", "public, max-age=31536000");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    next();
  });
  app.use("/attached_assets/generated_images", async (req, res, next) => {
    const cleanPath = req.path.replace(/^\//, "");
    const filePath = path.join(serverAssetsDir, cleanPath);
    if (fs.existsSync(filePath)) res.sendFile(filePath);
    else next();
  });

  // Caminho curto: /generated_images/<ficheiro>
  app.use("/generated_images", (req, res, next) => {
    res.setHeader("Cache-Control", "public, max-age=31536000");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    next();
  });
  app.use("/generated_images", async (req, res, next) => {
    const cleanPath = req.path.replace(/^\//, "");
    const filePath = path.join(serverAssetsDir, cleanPath);
    if (fs.existsSync(filePath)) res.sendFile(filePath);
    else next();
  });

  // Rotas do Retell AI
  app.use("/api/retell", retellRoutes);

  const httpServer = createServer(app);
  return httpServer;
}