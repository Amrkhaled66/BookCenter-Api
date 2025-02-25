import axios from "axios";

const createInvoice = async (invoiceData) => {
  try {
    const response = await axios.post(process.env.FAWATERK_URL, invoiceData, {
      headers: {
        Authorization: `Bearer ${process.env.FAWATERK_API_KEY}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Fawaterk API Error:", error.response?.data || error.message);
    throw new Error("Failed to create invoice");
  }
};

export { createInvoice };
