import { createSignal } from "solid-js";
import { match, P } from "ts-pattern";

import { trpc } from "~/lib/trpc";
import type { Maybe, Result } from "~/lib/types";
import { Button } from "~/components/ui/button";

export default () => {
	// https://youtu.be/eN0_me2cCSI
	// b8d7a9d651f3
	const [a, setA] = createSignal<string>("");
	return (
		<div>
			<Button
				onClick={async () => {
					const res = await trpc.createLink.mutate("https://uta-tools.vercel.app/");

					console.log(res);

					// match(res)
					// 	.with({ ok: false }, () => {
					// 		setA("error");
					// 	})
					// 	.with({ ok: true, value: P.select() }, (res) => {
					// 		console.log(res);
					// 	});

					// const res = await trpc.checkSlug.query("b8d7a9d651f3");

					// console.log(res);

					// match(res)
					// 	.with({ ok: false }, () => {
					// 		setA("error");
					// 	})
					// 	.with({ ok: true, value: { ok: false } }, (res) => {
					// 		setA("No url found");
					// 	})
					// 	.with({ ok: true, value: { ok: true } }, ({ ok, value }) => {
					// 		setA(value.value);
					// 	});
				}}
			>
				generate
			</Button>
			{a()}
		</div>
	);
};
