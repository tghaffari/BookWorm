set client_min_messages to warning;

-- DANGER: this is NOT how to do it in the real world.
-- `drop schema` INSTANTLY ERASES EVERYTHING.
drop schema "public" cascade;

create schema "public";

CREATE TABLE "public"."users" (
	"userId" serial NOT NULL UNIQUE,
	"username" TEXT NOT NULL UNIQUE,
	"name" TEXT NOT NULL,
	"hashedPassword" TEXT NOT NULL,
	"joinedAt" timestamptz(6) NOT NULL default now(),
	CONSTRAINT "users_pk" PRIMARY KEY ("userId")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "public"."books" (
	"bookId" serial NOT NULL,
	"googleId" TEXT NOT NULL,
	"title" TEXT NOT NULL,
	"author" TEXT NOT NULL,
	"description" TEXT NOT NULL,
	"publishedDate" TEXT NOT NULL,
	"isbn" TEXT NOT NULL UNIQUE,
	"coverImgURL" TEXT NOT NULL,
	CONSTRAINT "books_pk" PRIMARY KEY ("bookId")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "public"."quotes" (
	"userId" int NOT NULL,
	"bookId" int NOT NULL,
	"quote" TEXT NOT NULL,
	"pageNumber" TEXT NOT NULL,
	"quotedAt" timestamptz NOT NULL default now()
) WITH (
  OIDS=FALSE
);



CREATE TABLE "public"."library" (
	"bookId" int NOT NULL,
	"completedAt" timestamptz,
	"savedAt" timestamptz NOT NULL default now(),
	"userId" int NOT NULL
) WITH (
  OIDS=FALSE
);





ALTER TABLE "quotes" ADD CONSTRAINT "quotes_fk0" FOREIGN KEY ("userId") REFERENCES "users"("userId");
ALTER TABLE "quotes" ADD CONSTRAINT "quotes_fk1" FOREIGN KEY ("bookId") REFERENCES "books"("bookId");

ALTER TABLE "library" ADD CONSTRAINT "library_fk0" FOREIGN KEY ("bookId") REFERENCES "books"("bookId");
ALTER TABLE "library" ADD CONSTRAINT "library_fk1" FOREIGN KEY ("userId") REFERENCES "users"("userId");
