type ToolCategory = {
	name: string;
	description: string;
	tools: Tool[];
};

type Tool = {
	name: string;
	description: string;
	href: string;
};

export const tools: ToolCategory[] = [
	{
		name: "Converters",
		description: "Convert between different formats",
		tools: [
			{
				name: "Base64",
				description: "Encode/Decode base64 formatted strings",
				href: "/tools/converters/base64",
			},
			{
				name: "Hex",
				description: "Encode/Decode hex values to/from strings",
				href: "/tools/converters/hex",
			},
		],
	},
	{
		name: "Image",
		description: "Image manipulation tools",
		tools: [
			{
				name: "Image Base64",
				description: "Convert an image to a base64 encoded string",
				href: "/tools/image/image-base64",
			},
		],
	},
];
