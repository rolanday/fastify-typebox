// ESM
import Fastify from "fastify";
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import { Type } from "@sinclair/typebox";
import { Value } from "@sinclair/typebox/value";
const fastify = Fastify({
  logger: true,
}).withTypeProvider<TypeBoxTypeProvider>();

const TBBody = Type.Object({
  test: Type.String(),
});

// The following post should fail, but doesn't because 4 getting converted to a string ("4")
// post http://localhost:3000
// {
//     "test": 4
// }

fastify.post(
  "/",
  // { // If uncomment these lines, test val gets converted to a string (i.e., "4", instead as expected, 4)
  //   schema: {
  //     body: TBBody,
  //   },
  // },
  async (request, reply) => {
    const checked = Value.Check(TBBody, request.body);
    console.log("checked", checked); // false <== as expected (test val should be a string). unless uncomment schema check above, in which cases true

    console.log(request.body);
    return { hello: "world" };
  }
);

/**
 * Run the server!
 */
const start = async () => {
  try {
    await fastify.listen({ port: 3000, host: "0.0.0.0" });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();
