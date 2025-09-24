import { Card } from "../components/Card";

export default function Login() {
    return (
        <Card className="w-[500px] h-[250px]">
            <div className="w-full">
                <div>
                    <h3 className="mt-6 text-3xl text-center font-extrabold text-gray-900">
                        _postscript
                    </h3>
                </div>
                <form className="mt-8 space-y-6" action="#" method="POST">
                    <div>
                        <label htmlFor="email-address" className="sr-only">
                            Email address
                        </label>
                        <input
                            id="email-address"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                            placeholder="Email address"
                        />
                    </div>
                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Receive a magic link
                        </button>
                    </div>
                </form>
            </div>
        </Card>
    );
}