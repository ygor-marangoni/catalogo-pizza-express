import { createResourceApi } from "./resource-api";
const base = createResourceApi("/categories");

function toFormData(values) {
  const form = new FormData();
  Object.entries(values).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") form.append(key, value);
  });
  return form;
}

export const categoriesApi = {
  ...base,
  create: (values) => base.create(toFormData(values)),
  update: (id, values) => base.update(id, toFormData(values)),
};
