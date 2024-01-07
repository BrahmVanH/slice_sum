import { ISliceEntry, SliceEntry } from "../models";
import { Request, Response } from "express";

export const getAllEntries = async (req: Request, res: Response) => {
  try {
    const entries = await SliceEntry.find({});
    if (!entries) {
			return res.status(400).json({ message: 'No entries available in db' });

    }

    return res.json(entries);

  } catch (err) {
    return res.status(500).json(err);
  }
}

export const getLastTwentyEntries = async (req: Request, res: Response) => {
	try {
		const entries = await SliceEntry.find({}).limit(20);
		if (!entries) {
			return res.status(400).json({ message: 'No entries available in db' });
		}

		return res.json(entries);
	} catch (err) {
		return res.status(500).json(err);
	}
};