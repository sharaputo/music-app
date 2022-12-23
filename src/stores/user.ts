import { defineStore } from "pinia";
import { ref } from "vue";
import { auth, usersCollection } from "@/includes/firebase";
import type UserRegister from "@/types/UserRegister";
import type UserLogin from "@/types/UserLogin";

export default defineStore("user", () => {
  const userLoggedIn = ref(false);

  const setLoginState = (): void => {
    userLoggedIn.value = true;
  };
  const registerUser = async (values: UserRegister): Promise<void> => {
    const userCred = await auth.createUserWithEmailAndPassword(
      values.email,
      values.password
    );

    await usersCollection.doc(userCred.user?.uid).set({
      name: values.name,
      email: values.email,
      age: values.age,
      country: values.country,
    });

    await userCred.user?.updateProfile({
      displayName: values.name,
    });

    userLoggedIn.value = true;
  };
  const authenticate = async (values: UserLogin): Promise<void> => {
    await auth.signInWithEmailAndPassword(values.email, values.password);

    userLoggedIn.value = true;
  };
  const signout = async (): Promise<void> => {
    await auth.signOut();

    userLoggedIn.value = false;
  };

  return { userLoggedIn, setLoginState, registerUser, authenticate, signout };
});
