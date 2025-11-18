import { type Furniture, type InsertFurniture, type Project, type InsertProject } from "../shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getFurniture(): Promise<Furniture[]>;
  getProjects(): Promise<Project[]>;
  getProject(id: string): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
}


export class MemStorage implements IStorage {
  private furniture: Map<string, Furniture>;
  private projects: Map<string, Project>;

  constructor() {
    this.furniture = new Map();
    this.projects = new Map();
    this.initializeFurniture();
  }

  private initializeFurniture() {
    const initialFurniture: Furniture[] = [
      // Camas
      {
        id: "bed-1",
        name: "Cama RAMNEFJÄLL",
        category: "bed",
        imageUrl: "/generated_images/RAMNEFJÄLL.png",
        style: "Moderno",
        price: "€259",
        brand: "DecorAR",
      },
      {
        id: "bed-2",
        name: "Cama TÄLLÅSEN",
        category: "bed",
        imageUrl: "/generated_images/TÄLLÅSEN.png",
        style: "Contemporâneo",
        price: "€239",
        brand: "DecorAR",
      },
      {
        id: "bed-3",
        name: "Armario BRIMNES",
        category: "desk",
        imageUrl: "/generated_images/BRIMNES_159_-removebg-preview.png",
        style: "Moderno",
        price: "€159",
        brand: "DecorAR",
      },
      {
        id: "bed-4",
        name: "Armario KLEPPSTAD",
        category: "desk",
        imageUrl: "/generated_images/KLEPPSTAD_149_-removebg-preview.png",
        style: "Rústico",
        price: "€149",
        brand: "DecorAR",
      },
      {
        id: "bed-5",
        name: "Cama NEIDEN",
        category: "bed",
        imageUrl: "/generated_images/NEIDEN-74-removebg-preview.png",
        style: "Minimalista",
        price: "€74",
        brand: "DecorAR",
      },
      
      // Secretárias
      {
        id: "desk-1",
        name: "Secretária ALEX",
        category: "desk",
        imageUrl: "/generated_images/ALEX_129_-removebg-preview.png",
        style: "Moderno",
        price: "€129",
        brand: "DecorAR",
      },
      {
        id: "desk-2",
        name: "Jaro BLODBJORK",
        category: "vase",
        imageUrl: "/generated_images/BLODBJORK_22_-removebg-preview.png",
        style: "Clássico",
        price: "€22",
        brand: "DecorAR",
      },
      {
        id: "desk-3",
        name: "Secretária FJALLBO",
        category: "desk",
        imageUrl: "/generated_images/FJALLBO_149_-removebg-preview.png",
        style: "Industrial",
        price: "€149",
        brand: "DecorAR",
      },
      {
        id: "desk-4",
        name: "Secretária KALLAX",
        category: "desk",
        imageUrl: "/generated_images/KALLAX_55_-removebg-preview.png",
        style: "Minimalista",
        price: "€55",
        brand: "DecorAR",
      },
      {
        id: "desk-5",
        name: "Espelho LINDBYAN",
        category: "mirror",
        imageUrl: "/generated_images/LINDBYAN_49_99_-removebg-preview.png",
        style: "Moderno",
        price: "€49.99",
        brand: "DecorAR",
      },
      
      // Lâmpadas
      {
        id: "lamp-1",
        name: "Cama GRUNNARP",
        category: "bed",
        imageUrl: "/generated_images/GRUNNARP_549-removebg-preview.png",
        style: "Contemporâneo",
        price: "€549",
        brand: "DecorAR",
      },
      {
        id: "lamp-2",
        name: "Secretaria HUVUDSPELARE",
        category: "desk",
        imageUrl: "/generated_images/HUVUDSPELARE_158_99_-removebg-preview.png",
        style: "Moderno",
        price: "€158.99",
        brand: "DecorAR",
      },
      
      // Jarros
      {
        id: "vase-1",
        name: "Jarro HULTET",
        category: "vase",
        imageUrl: "/generated_images/HULTET_4_99_-removebg-preview.png",
        style: "Minimalista",
        price: "€4.99",
        brand: "DecorAR",
      },
      
      // Cestos
      {
        id: "basket-1",
        name: "Cesto GNABBAS",
        category: "basket",
        imageUrl: "/generated_images/GNABBAS_9_99_-removebg-preview.png",
        style: "Natural",
        price: "€9.99",
        brand: "DecorAR",
      },
      
      // Espelhos
      {
        id: "mirror-2",
        name: "Cama 269-FRIDHULT",
        category: "bed",
        imageUrl: "/generated_images/269-FRIDHULT-removebg-preview.png",
        style: "Moderno",
        price: "€269",
        brand: "DecorAR",
      },
      
      // Plantas
      {
        id: "plant-1",
        name: "Planta FEJKA Pequena",
        category: "plant",
        imageUrl: "/generated_images/FEJKA_16_-removebg-preview.png",
        style: "Natural",
        price: "€16",
        brand: "DecorAR",
      },
      {
        id: "plant-2",
        name: "Planta FEJKA Grande",
        category: "plant",
        imageUrl: "/generated_images/FEJKA_49_99__-removebg-preview.png",
        style: "Natural",
        price: "€49.99",
        brand: "DecorAR",
      },
      {
        id: "plant-3",
        name: "Cesto KNIPSA",
        category: "basket",
        imageUrl: "/generated_images/KNIPSA_12_-removebg-preview.png",
        style: "Natural",
        price: "€12",
        brand: "DecorAR",
      },
      {
        id: "plant-4",
        name: "Espelho LILJETRAD",
        category: "mirror",
        imageUrl: "/generated_images/LILJETRAD_17_99_-removebg-preview.png",
        style: "Natural",
        price: "€17.99",
        brand: "DecorAR",
      },
      
      // Itens adicionais
      {
        id: "decoration-1",
        name: "Cama IDANÄS",
        category: "bed",
        imageUrl: "/generated_images/IDANÄS.png",
        style: "Moderno",
        price: "€899",
        brand: "DecorAR",
      },
      {
        id: "decoration-2",
        name: "Cama SKÖNABÄCK",
        category: "bed",
        imageUrl: "/generated_images/SKÖNABÄCK_299-removebg-preview.png",
        style: "Moderno",
        price: "€299",
        brand: "DecorAR",
      },
      {
        id: "decoration-3",
        name: "Poltrona FRIHETEN",
        category: "bed",
        imageUrl: "/generated_images/FRIHETEN_449-removebg-preview.png",
        style: "Escandinavo",
        price: "€449",
        brand: "DecorAR",
      },
      {
        id: "decoration-4",
        name: "Cama HEMNES",
        category: "bed",
        imageUrl: "/generated_images/HEMNES-224-removebg-preview.png",
        style: "Rústico",
        price: "€224",
        brand: "DecorAR",
      },
      {
        id: "decoration-5",
        name: "Cama KIVIK",
        category: "bed",
        imageUrl: "/generated_images/KIVIK-649-removebg-preview.png",
        style: "Moderno",
        price: "€649",
        brand: "DecorAR",
      },
    ];

    initialFurniture.forEach((item) => {
      this.furniture.set(item.id, item);
    });
  }

  async getFurniture(): Promise<Furniture[]> {
    return Array.from(this.furniture.values());
  }

  async getProjects(): Promise<Project[]> {
    return Array.from(this.projects.values());
  }

  async getProject(id: string): Promise<Project | undefined> {
    return this.projects.get(id);
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const id = randomUUID();
    const project: Project = {
      ...insertProject,
      id,
      createdAt: new Date(),
    };
    this.projects.set(id, project);
    return project;
  }

}

export const storage = new MemStorage();
