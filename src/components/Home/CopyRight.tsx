import Link from "next/link";

const Copyright = (props: any) => {
    return (
        <h1 className=" flex  justify-center  text-sm text-gray-600 ">
            {"Copyright © "}
            <Link color="inherit" href="#">
                Your Website
            </Link>{" "}
            {new Date().getFullYear()}
            {"."}
        </h1>
    );
}

export default Copyright