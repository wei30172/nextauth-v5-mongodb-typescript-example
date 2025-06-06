import { Model, FilterQuery, UpdateQuery } from "mongoose"

interface UpdateFieldOptions<T> {
  model: Model<T>
  filter: FilterQuery<T>
  field: keyof T
  value: T[keyof T]
}

export const updateModelField = async <T>({
  model,
  filter,
  field,
  value
}: UpdateFieldOptions<T>) => {
  try {
    const update: UpdateQuery<T> = {
      $set: { [field]: value } as Partial<T>
    }
    
    const result = await model.updateMany(filter, update)

    console.log(`Updated field "${String(field)}" with value:`, value)
    console.log("Matched:", result.matchedCount)
    console.log("Modified:", result.modifiedCount)

    return { success: true, result }
  } catch (error) {
    console.error(`Error updating field "${String(field)}":`, error)
    return { success: false, error }
  }
}