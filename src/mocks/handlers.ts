import { rest } from "msw";
import { build, fake, sequence } from "@devndive/test-data-bot";
import { Link, Metadata, Tag } from "../types";
import { intersection } from "lodash";

const tagBuilder = build<Tag>("Tag", {
  fields: {
    name: fake((f) => f.internet.userName()),
  },
});

const metadataBuilder = build<Metadata>("Metadata", {
  fields: {
    id: sequence(),
    title: fake((f) => f.lorem.word()),
    description: fake((f) => f.lorem.words()),
    image: fake((f) =>
      f.image.imageUrl(640, 480, undefined, true, true).replace("lorempixel.com", "placeimg.com")
    ),
    estimatedTimeToRead: fake((f) => f.datatype.number(45)),
  },
});

const linkBuilder = build<Link>("Link", {
  fields: {
    id: sequence(),
    url: fake((f) => f.internet.url()),
    description: fake((f) => f.lorem.words()),
    metadata: fake((f) => metadataBuilder()),
    tags: [],
  },
  postBuild: (link) => {
    link.tags = Array(3)
      .fill(undefined)
      .map((_) => tagBuilder());
    return link;
  },
});

let links = Array(1)
  .fill(undefined)
  .map((_) => linkBuilder());

export const handlers = [
  rest.get("/api/links", (req, res, ctx) => {
    const tags = req.url.searchParams.getAll("tags");

    let matchingLinks = links;
    if (tags.length > 0) {
      matchingLinks = matchingLinks.filter((m) => {
        const t = m.tags.map((t) => t.name);

        return intersection(t, tags).length > 0;
      });
    }

    return res(
      ctx.status(200),
      ctx.json({
        data: matchingLinks,
      })
    );
  }),
  rest.get("/api/links/:linkId", (req, res, ctx) => {
    const { linkId } = req.params as { linkId: string };

    const link = links.find((l) => l.id === Number.parseInt(linkId));

    if (link) {
      return res(ctx.status(200), ctx.json(link));
    }

    return res(ctx.status(404));
  }),
  rest.post("/api/links", (req, res, ctx) => {
    // @ts-ignore
    const { url, description, tags } = JSON.parse(req.body);

    const link = linkBuilder();
    // @ts-ignore
    link.metadata = null;
    link.url = url;
    link.description = description;
    link.tags = tags;

    links = [...links, link];

    return res(ctx.status(200), ctx.json(link));
  }),
  rest.put("/api/links/:linkId", (req, res, ctx) => {
    const { linkId } = req.params as { linkId: string };
    // @ts-ignore
    const { url, description, tags } = JSON.parse(req.body);

    links.forEach((l) => {
      if (l.id === Number.parseInt(linkId)) {
        l.url = url;
        l.description = description;
        l.tags = tags;
      }
    });

    return res(ctx.status(200));
  }),
  rest.delete("/api/links/:linkId", (req, res, ctx) => {
    const { linkId } = req.params as { linkId: string };

    links = links.filter((l) => l.id !== Number.parseInt(linkId));

    return res(
      ctx.status(200),
      ctx.json({
        data: links,
      })
    );
  }),
  rest.post("/api/links/:linkId/updateMetadata", (req, res, ctx) => {
    const { linkId } = req.params as { linkId: string };

    links.forEach((l) => {
      if (l.id === Number.parseInt(linkId)) {
        l.metadata = metadataBuilder();
      }
    });
  }),
];
