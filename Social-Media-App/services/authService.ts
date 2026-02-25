import { supabase } from "@/lib/supabase";

export const AuthService = {
  async signIn(email: string, password: string) {
    if (!email || !password) throw new Error("Please fill all fields");

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: password.trim(),
    });

    if (error) throw error;

    return data;
  },

  async signUp(email: string, password: string, name: string) {
    if (!email || !password) throw new Error("Please fill all fields");

    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password: password.trim(),
      options: {
        data: {
          name: name.trim(),
        },
      },
    });

    if (error) throw error;

    return data;
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();

    if (error) throw error;
  },
};
