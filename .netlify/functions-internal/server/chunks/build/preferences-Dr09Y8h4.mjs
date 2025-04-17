import { jsxs, jsx } from 'react/jsx-runtime';

const s = function() {
  return jsxs("div", { className: "container px-4 py-6", children: [jsxs("header", { className: "mb-6", children: [jsx("h1", { className: "text-2xl font-bold", children: "Pr\xE9f\xE9rences utilisateur" }), jsx("p", { children: "Modifiez vos pr\xE9f\xE9rences utilisateur pour personnaliser votre exp\xE9rience sur le site." })] }), jsxs("div", { className: "grid gap-4", children: [jsx("article", { className: "border border-gray-300 p-4 rounded-sm", children: jsx("h2", { className: "text-xl font-bold", children: "Informations personnelles" }) }), jsx("article", { className: "border border-gray-300 p-4 rounded-sm", children: jsx("h2", { className: "text-xl font-bold", children: "Supprimer mon compte" }) })] })] });
};

export { s as component };
//# sourceMappingURL=preferences-Dr09Y8h4.mjs.map
