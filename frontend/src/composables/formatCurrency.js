export const useFormatCurrency = (value) => {   
        if (!value) return "";
        return "₦" + value.toLocaleString();
};
