import { Model } from "mongoose"

export const createOne = async <T>(model: Model<T>, data: Partial<T>) => {
  try {
    const created = await model.create(data)
    return { success: true, data: created }
  } catch (error) {
    console.error("Create error:", error)
    return { success: false, error }
  }
}