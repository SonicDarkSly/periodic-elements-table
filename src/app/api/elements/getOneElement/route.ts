// export async function GET(Request) {} 
// export async function HEAD(Request) {} 
// export async function POST(Request) {} 
// export async function PUT(Request) {} 
// export async function DELETE(Request) {} 

import { NextRequest, NextResponse } from 'next/server';
import data from '../../../parameters/elements-list.json';

export async function GET(request: NextRequest) {

  const atomicNumberParam = request.nextUrl.searchParams.get("number");

  if (atomicNumberParam !== null) {
    const atomicNumber: number = parseInt(atomicNumberParam, 10);

    const element = data.list.find(elmt => elmt.atomicNumber === atomicNumber);

    return NextResponse.json(element);

  } else {
    return NextResponse.json(null);
  }
}
