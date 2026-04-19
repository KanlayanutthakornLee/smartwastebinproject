import { fetchBins } from "./bin.service.js";

export const getBins = async (req, res) => {
  try {
    const bins = await fetchBins();
    res.json(bins);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};