import type {
	RawServerBase,
	RawServerDefault,
	FastifyPluginAsync,
} from "fastify"

import fp, { PluginMetadata } from "fastify-plugin"
import type { WithRequired } from "@apollo/utils.withrequired"
import type { ApolloServer, BaseContext } from "@apollo/server"

import { fastifyApolloHandler } from "./handler"
import { ApolloFastifyPluginOptions } from "./types"

const pluginMetadata: PluginMetadata = {
	fastify: "4.x",
	name: "apollo-server-fastify",
}

export function fastifyApollo<
	RawServer extends RawServerBase = RawServerDefault,
>(
	apollo: ApolloServer<BaseContext>,
): FastifyPluginAsync<Omit<ApolloFastifyPluginOptions<BaseContext, RawServer>, "context">, RawServer>

export function fastifyApollo<
	Context extends BaseContext = BaseContext,
	RawServer extends RawServerBase = RawServerDefault,
>(
	apollo: ApolloServer<Context>,
): FastifyPluginAsync<WithRequired<ApolloFastifyPluginOptions<Context, RawServer>, "context">, RawServer>

export function fastifyApollo<
	Context extends BaseContext = BaseContext,
	RawServer extends RawServerBase = RawServerDefault,
>(
	apollo: ApolloServer<Context>,
): FastifyPluginAsync<WithRequired<ApolloFastifyPluginOptions<Context, RawServer>, "context">, RawServer> {
	return fp(
		async (fastify, options) => {
			const {
				path = "/graphql",
				method = ["GET", "POST"],
				...handlerOptions
			} = options

			fastify.route({
				method,
				url: path,
				handler: fastifyApolloHandler<Context, RawServer>(apollo, handlerOptions),
			})
		},
		pluginMetadata,
	)
}