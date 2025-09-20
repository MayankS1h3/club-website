import { ZodError } from "zod";

export const validate = (schema) => (req,res,next) => {
    try{
        schema.parse({body: req.body, query: req.query, params: req.params});
        next();
    }catch (e){
        if (e instanceof ZodError) return res.status(400).json({ error: e.issues });
        next(e);
    }
}