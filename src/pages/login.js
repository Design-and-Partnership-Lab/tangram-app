import TangramNav from "../components/TangramNav";
import router from "next/router";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <>
      <div className="flex flex-col items-center justify-between w-full h-screen">
        <header className="flex justify-start w-full items-center">
          <TangramNav />
        </header>
        <main className="flex flex-grow justify-center w-full items-center mb-[132px]">
          <Login />
        </main>
      </div>
      <div className="fixed bottom-2 right-0">
        <Footer />
      </div>
    </>
  );
}

function Login() {
  return (
    <div className="hero min-h-[80%]">
      <div className="m-8 mt-12">
        <div className="grid grid-cols-1">
          <h1 className="text-5xl mb-10">
            <b>Login to your account</b>
          </h1>

          <input
            type="text"
            placeholder="Type here"
            className="input input-bordered w-full max-w-xs mb-3"
          />
          <input
            type="text"
            placeholder="Password"
            className="input input-bordered w-full max-w-xs mb-10"
          />
          <div>
            <button
              className="btn btn-primary mr-5"
              onClick={() => {
                router.push("/overview"); // do a database check here
              }}
            >
              Login
            </button>

            <button
              className="btn btn-primary"
              onClick={() => {
                router.push("/overview");
              }}
            >
              Sign up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
