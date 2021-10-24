import Auth from "@aws-amplify/auth";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { Link } from "../types";

const defaultOptions = async () => {
  const user = await Auth.currentAuthenticatedUser();

  if (user) {
    const token = user.signInUserSession.idToken.jwtToken;

    return {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    };
  }
};

const fetchWithDefaultOptions = async (r: RequestInfo, init?: RequestInit) => {
  const o = await defaultOptions();
  return fetch(r, { ...o, ...init });
};

export const useCreateLinkMutation = () => {
  return useMutation(async (link: Omit<Link, "id" | "metadata">) => {
    return fetchWithDefaultOptions("/api/links", { method: "POST", body: JSON.stringify(link) });
  });
};

export const useUpdateLinkMutation = () => {
  return useMutation(async (link: Omit<Link, "metadata">) => {
    return fetchWithDefaultOptions(`/api/links/${link.id}`, {
      method: "PUT",
      body: JSON.stringify(link),
    });
  });
};

export const useLink = (id: string) => {
  return useQuery<Link>(["links", id], () => {
    return fetchWithDefaultOptions(`/api/links/${id}`).then((response) => response.json());
  });
};

function invokeFetchLinks(tag?: string) {
  const url = tag ? "/api/links" : `/api/links?tags=${tag}`;
  return fetchWithDefaultOptions(url)
    .then((response) => response.json())
    .then((json) => json.data);
}

export const useLinks = (tag?: string) => {
  return useQuery<Link[]>("links", () => invokeFetchLinks(tag));
};

export const useUpdateMetadataMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(
    (link: Pick<Link, "id">) => {
      return fetchWithDefaultOptions(`/api/links/${link.id}/updateMetadata`, {
        method: "POST",
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("links");
      },
    }
  );
};

export const useDeleteLinkMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(
    (link: Pick<Link, "id">) => {
      return fetchWithDefaultOptions(`/api/links/${link.id}`, {
        method: "DELETE",
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("links");
      },
    }
  );
};
