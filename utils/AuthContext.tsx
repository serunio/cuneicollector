import {Context, createContext, Dispatch, SetStateAction, useState} from "react";
import {User} from "@/types";

type UserContext = {user: User | null, setUser: Dispatch<SetStateAction<User | null>> | null}
export const ctxAuth: Context<UserContext> = createContext<UserContext>({user:null, setUser:null})