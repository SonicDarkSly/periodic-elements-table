// export async function GET(Request) {}
// export async function HEAD(Request) {}
// export async function POST(Request) {}
// export async function PUT(Request) {}
// export async function DELETE(Request) {}


import data from "../../../parameters/elements-list.json";

export async function GET(req) {
  const atomicNumberParam = req.nextUrl.searchParams.get("number");

  if (atomicNumberParam) {
    const atomicNumber = parseInt(atomicNumberParam, 10);

    const element = data.list.find(
      (elmt) => elmt.atomicNumber === atomicNumber
    );

    if (!element) {
      return Response.json({message: "Element non répertorié"}, {
        status: 404,
      });
    }

    return Response.json(element, {
      status: 200,
    });

  } else {
    return Response.json({message: "Erreur 500"}, {
      status: 500
    });
  }
}
