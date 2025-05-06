
export const itemsShopifyColourList: { label: "decorative" | "accent" | "subdued" | "info" | "success" | "warning" | "critical", key: string }[] = [
    {
        label: "primary",
        key: "#ffffff",
    },
    {
        label: "info",
        key: "#000000",
    },
    {
        label: "warning",
        key: "#8f6900",
    },
    {
        label: "accent",
        key: "#455a68",
    },
    {
        label: "subdued",
        key: "#707070",
    },
    {
        label: "critical",
        key: "#d91c1c",
    },
    {
        label: "decorative",
        key: "#1773b0",
    },
    {
        label: "success",
        key: "#4d7a50",
    },
];

export const itemShopifyButtonTypeList: { label: "default" | "critical" | "monochrome", key: string }[] = [
    {
        label: "default",
        key: "#93bad4",
    },
    {
        label: "critical",
        key: "#d91c1c",
    },
    {
        label: "monochrome",
        key: "#000000",
    },
];

export const itemsShopifySizeList: { label: "extraSmall" | "small" | "base" | "large" | "extraLarge", key: string }[] = [
    {
        label: "small",
        key: "12",
    },
    {
        label: "base",
        key: "16",
    },
    {
        label: "large",
        key: "19",
    },
    {
        label: "extraLarge",
        key: "21",
    },
];

export const getLabelFromKeySize = (
    key: string,
    list: { label: "extraSmall" | "small" | "base" | "large" | "extraLarge"; key: string }[]
) => {
    return list.find((item) => item.key === key)?.label;
};

export const getLabelFromKeyButtonType = (
    key: string,
    list: { label: "default" | "critical" | "monochrome"; key: string }[]
) => {
    return list.find((item) => item.key === key)?.label;
};

export const getLabelFromKeyColour = (
    key: string,
    list: { label: "decorative" | "accent" | "subdued" | "info" | "success" | "warning" | "critical"; key: string }[]
) => {
    return list.find((item) => item.key === key)?.label;
};
