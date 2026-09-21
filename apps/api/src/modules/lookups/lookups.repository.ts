import { PrismaService } from "@/common/prisma/prisma.service";
import { Injectable } from "@nestjs/common";

@Injectable()
export class LookupsRepository {
	constructor(private readonly prisma: PrismaService) {}

	async getTechnologies() {
		return this.prisma.technology.findMany();
	}

	async getTags() {
		return this.prisma.tag.findMany();
	}
}