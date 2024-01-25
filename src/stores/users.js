import { ref } from "vue";
import { defineStore } from "pinia";
import { supabase } from "../supabase";

// Define the user store
export const useUserStore = defineStore("users", () => {
  const user = ref(null);
  const errorMessage = ref("");
  const loading = ref(false);
  const loadingUser = ref(false);

  // Validate email format
  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  // Handle user login
  const handleLogin = async (credentials) => {
    const { email, password } = credentials;

    if (!validateEmail(email)) {
      return (errorMessage.value = "Email is invalid");
    }

    if (!password.length) {
      return (errorMessage.value = "Password cannot be empty");
    }

    loading.value = true;

    // Convert email to lowercase
    const lowerCaseEmail = email.toLowerCase();

    const { error } = await supabase.auth.signInWithPassword({
      email: lowerCaseEmail,
      password,
    });

    if (error) {
      loading.value = false;
      return (errorMessage.value = error.message);
    }

    const { data: existingUser } = await supabase
      .from("users")
      .select()
      .eq("email", lowerCaseEmail)
      .single();

    user.value = {
      email: existingUser.email,
      username: existingUser.username,
      id: existingUser.id,
    };

    loading.value = false;
    errorMessage.value = "";
  };

  // Handle guest login
  const guestLogin = async () => {
    const guestEmail = "guest88@gmail.com";
    const guestPassword = "welcome123";

    await handleLogin({ email: guestEmail, password: guestPassword });
  };

  // Handle user signup
  const handleSignup = async (credentials) => {
    const { email, password, username } = credentials;

    // Validations
    if (password.length < 6) {
      errorMessage.value = "Password length is too short";
      return errorMessage.value;
    }

    if (username.length < 4) {
      errorMessage.value = "Username length is too short";
      return errorMessage.value;
    }

    if (!validateEmail(email)) {
      errorMessage.value = "Invalid email address";
      return errorMessage.value;
    }

    errorMessage.value = "";

    loading.value = true;

    // Check if user with username already exists
    const { data: userWithUsername } = await supabase
      .from("users")
      .select()
      .eq("username", username)
      .single();

    if (userWithUsername) {
      loading.value = false;
      return (errorMessage.value = "User already registered");
    }

    // Convert email to lowercase
    const lowerCaseEmail = email.toLowerCase();

    // Check if user with email already exists
    const { error } = await supabase.auth.signUp({
      email: lowerCaseEmail,
      password,
    });

    if (error) {
      loading.value = false;
      return (errorMessage.value = error.message);
    }

    // Sign up user
    await supabase.from("users").insert({
      username,
      email: lowerCaseEmail,
    });

    const { data: newUser } = await supabase
      .from("users")
      .select()
      .eq("email", email)
      .single();

    user.value = {
      id: newUser.id,
      email: newUser.email,
      username: newUser.username,
    };

    loading.value = false;
  };

  // Handle user logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
    user.value = null;
  };

  // Get user information
  const getUser = async () => {
    loadingUser.value = true;
    const { data } = await supabase.auth.getUser();

    if (!data.user) {
      loadingUser.value = false;
      return (user.value = null);
    }

    const { data: userWithEmail } = await supabase
      .from("users")
      .select()
      .eq("email", data.user.email.toLocaleLowerCase())
      .single();

    user.value = {
      username: userWithEmail.username,
      email: userWithEmail.email,
      id: userWithEmail.id,
    };

    loadingUser.value = false;
  };

  // Clear error message
  const clearErrorMessage = () => {
    errorMessage.value = "";
  };

  // Return the store methods and properties
  return {
    user,
    errorMessage,
    loading,
    loadingUser,
    handleLogin,
    handleSignup,
    handleLogout,
    getUser,
    clearErrorMessage,
    guestLogin,
  };
});
