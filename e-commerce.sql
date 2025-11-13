--
-- PostgreSQL database dump
--

\restrict nw8NmA3hzTe3Lf8rHIiTD5zBrU3aTfSf4hpPL0GGogmJVbQG6jC0mqCAbgZkLcw

-- Dumped from database version 18.0
-- Dumped by pg_dump version 18.0

-- Started on 2025-11-13 22:58:11

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 5 (class 2615 OID 24671)
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO postgres;

--
-- TOC entry 5222 (class 0 OID 0)
-- Dependencies: 5
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA public IS '';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 220 (class 1259 OID 24673)
-- Name: applications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.applications (
    id integer NOT NULL,
    notes text,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    app_name character varying(255) NOT NULL,
    app_code character varying(255)
);


ALTER TABLE public.applications OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 24672)
-- Name: applications_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.applications_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.applications_id_seq OWNER TO postgres;

--
-- TOC entry 5224 (class 0 OID 0)
-- Dependencies: 219
-- Name: applications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.applications_id_seq OWNED BY public.applications.id;


--
-- TOC entry 222 (class 1259 OID 24686)
-- Name: branches; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.branches (
    id integer NOT NULL,
    "applicationId" integer NOT NULL,
    name character varying(255) NOT NULL,
    code character varying(255),
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.branches OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 24685)
-- Name: branches_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.branches_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.branches_id_seq OWNER TO postgres;

--
-- TOC entry 5225 (class 0 OID 0)
-- Dependencies: 221
-- Name: branches_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.branches_id_seq OWNED BY public.branches.id;


--
-- TOC entry 230 (class 1259 OID 28433)
-- Name: packages; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.packages (
    id integer NOT NULL,
    "noResi" character varying(255) NOT NULL,
    ekspedisi character varying(255) NOT NULL,
    scan_masuk timestamp with time zone,
    by_masuk character varying(255),
    scan_keluar timestamp with time zone,
    by_keluar character varying(255),
    status character varying(255) DEFAULT 'Pending'::character varying NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.packages OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 28432)
-- Name: packages_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.packages_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.packages_id_seq OWNER TO postgres;

--
-- TOC entry 5226 (class 0 OID 0)
-- Dependencies: 229
-- Name: packages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.packages_id_seq OWNED BY public.packages.id;


--
-- TOC entry 224 (class 1259 OID 24705)
-- Name: roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.roles (
    id integer NOT NULL,
    "branchId" integer NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.roles OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 24704)
-- Name: roles_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.roles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.roles_id_seq OWNER TO postgres;

--
-- TOC entry 5227 (class 0 OID 0)
-- Dependencies: 223
-- Name: roles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.roles_id_seq OWNED BY public.roles.id;


--
-- TOC entry 228 (class 1259 OID 24740)
-- Name: user_role_mappings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_role_mappings (
    id integer NOT NULL,
    "applicationId" integer NOT NULL,
    "branchId" integer NOT NULL,
    "roleId" integer NOT NULL,
    "userId" integer NOT NULL,
    status boolean DEFAULT true,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.user_role_mappings OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 24739)
-- Name: user_role_mappings_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.user_role_mappings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.user_role_mappings_id_seq OWNER TO postgres;

--
-- TOC entry 5228 (class 0 OID 0)
-- Dependencies: 227
-- Name: user_role_mappings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.user_role_mappings_id_seq OWNED BY public.user_role_mappings.id;


--
-- TOC entry 226 (class 1259 OID 24724)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    "userName" character varying(255) NOT NULL,
    "fullName" character varying(255),
    email character varying(255),
    status boolean DEFAULT true,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    password character varying(255) NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 24723)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- TOC entry 5229 (class 0 OID 0)
-- Dependencies: 225
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- TOC entry 4881 (class 2604 OID 24676)
-- Name: applications id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications ALTER COLUMN id SET DEFAULT nextval('public.applications_id_seq'::regclass);


--
-- TOC entry 4882 (class 2604 OID 24689)
-- Name: branches id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.branches ALTER COLUMN id SET DEFAULT nextval('public.branches_id_seq'::regclass);


--
-- TOC entry 4888 (class 2604 OID 28436)
-- Name: packages id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.packages ALTER COLUMN id SET DEFAULT nextval('public.packages_id_seq'::regclass);


--
-- TOC entry 4883 (class 2604 OID 24708)
-- Name: roles id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles ALTER COLUMN id SET DEFAULT nextval('public.roles_id_seq'::regclass);


--
-- TOC entry 4886 (class 2604 OID 24743)
-- Name: user_role_mappings id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_role_mappings ALTER COLUMN id SET DEFAULT nextval('public.user_role_mappings_id_seq'::regclass);


--
-- TOC entry 4884 (class 2604 OID 24727)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- TOC entry 5206 (class 0 OID 24673)
-- Dependencies: 220
-- Data for Name: applications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.applications (id, notes, "createdAt", "updatedAt", app_name, app_code) FROM stdin;
5	Sistem HR Perusahaan	2025-10-17 05:15:44.083+07	2025-10-17 05:15:44.083+07	Human Resource	HR
6	Sistem FS Perusahaan	2025-10-17 05:16:03.597+07	2025-10-17 05:16:17.4+07	Finance System	FIN
7	Sistem Stok Barang	2025-10-17 05:16:40.196+07	2025-10-17 05:16:40.196+07	Inventory System	INV
8		2025-10-17 17:30:24.839+07	2025-10-17 17:30:24.839+07	Marketing	MR
9	Jogja	2025-10-17 17:37:46.273+07	2025-10-17 17:37:46.273+07	Sales	SL
\.


--
-- TOC entry 5208 (class 0 OID 24686)
-- Dependencies: 222
-- Data for Name: branches; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.branches (id, "applicationId", name, code, "createdAt", "updatedAt") FROM stdin;
3	5	HR Jakarta	HR-JKT	2025-10-17 05:17:08.438+07	2025-10-17 05:17:08.438+07
4	5	HR Bandung	HR-BDG	2025-10-17 05:17:28.01+07	2025-10-17 05:17:28.01+07
5	6	Finance Jakarta	FIN-JKT	2025-10-17 05:17:56.215+07	2025-10-17 05:17:56.215+07
6	7	Inventory Central	INV-CEN	2025-10-17 05:18:12.732+07	2025-10-17 05:18:12.732+07
7	8	Staff 1	S1	2025-10-17 17:31:17.937+07	2025-10-17 17:31:17.937+07
8	9	Head Office	HO	2025-10-17 17:38:35.67+07	2025-10-17 17:38:35.67+07
\.


--
-- TOC entry 5216 (class 0 OID 28433)
-- Dependencies: 230
-- Data for Name: packages; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.packages (id, "noResi", ekspedisi, scan_masuk, by_masuk, scan_keluar, by_keluar, status, "createdAt", "updatedAt") FROM stdin;
5	JNT832492304	J&T Express	2025-11-13 21:26:08.684+07	admin	\N	\N	Pending	2025-11-13 21:26:08.684+07	2025-11-13 21:26:08.684+07
6	JNE404534953	Jalur Nugraha Ekakurir	2025-11-13 21:26:16.495+07	admin	\N	\N	Pending	2025-11-13 21:26:16.495+07	2025-11-13 21:26:16.495+07
7	SCP943530423	SiCepat Express	2025-11-13 21:26:23.995+07	admin	\N	\N	Pending	2025-11-13 21:26:23.996+07	2025-11-13 21:26:23.996+07
8	ATJ923482056	Anteraja	2025-11-13 21:26:31.326+07	admin	\N	\N	Pending	2025-11-13 21:26:31.326+07	2025-11-13 21:26:31.326+07
9	NJX203495023	Ninja Xpress	2025-11-13 21:26:38.455+07	admin	\N	\N	Pending	2025-11-13 21:26:38.456+07	2025-11-13 21:26:38.456+07
10	JSX03842345	Jogja Express	2025-11-13 21:27:21.961+07	admin	\N	\N	Pending	2025-11-13 21:27:21.962+07	2025-11-13 21:27:21.962+07
11	TIKI023483635	Tidak Dikenal	2025-11-13 21:27:30.619+07	admin	\N	\N	Pending	2025-11-13 21:27:30.619+07	2025-11-13 21:27:30.619+07
12	POS823427345	Pos Indonesia	2025-11-13 21:27:58.902+07	admin	\N	\N	Pending	2025-11-13 21:27:58.903+07	2025-11-13 21:27:58.903+07
13	LPC847203482783	Lion Parcel	2025-11-13 21:28:15.809+07	admin	\N	\N	Pending	2025-11-13 21:28:15.809+07	2025-11-13 21:28:15.809+07
14	WHN82345893492	Wahana Express	2025-11-13 21:28:24.68+07	admin	\N	\N	Pending	2025-11-13 21:28:24.68+07	2025-11-13 21:28:24.68+07
15	GSD348582345	GoSend	2025-11-13 21:28:31.886+07	admin	\N	\N	Pending	2025-11-13 21:28:31.886+07	2025-11-13 21:28:31.886+07
16	GBE8384572345	Grab Express	2025-11-13 21:28:38.845+07	admin	\N	\N	Pending	2025-11-13 21:28:38.845+07	2025-11-13 21:28:38.845+07
17	SAP82345672834	SAP Express	2025-11-13 21:28:45.939+07	admin	\N	\N	Pending	2025-11-13 21:28:45.939+07	2025-11-13 21:28:45.939+07
19	SAP8234567282	SAP Express	2025-11-13 21:37:46.755+07	admin	2025-11-13 21:38:02.064+07	admin	Terkirim	2025-11-13 21:37:46.756+07	2025-11-13 21:47:08.115+07
18	TIKI827348730234	Titipan Kilat	2025-11-13 21:31:12.838+07	admin	\N	\N	Pending	2025-11-13 21:31:12.841+07	2025-11-13 21:53:11.719+07
\.


--
-- TOC entry 5210 (class 0 OID 24705)
-- Dependencies: 224
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.roles (id, "branchId", name, description, "createdAt", "updatedAt") FROM stdin;
3	3	HR Admin	Mengatur data karyawan	2025-10-17 05:18:44.35+07	2025-10-17 05:18:44.35+07
4	3	HR Staff	Input dan update data	2025-10-17 05:19:03.06+07	2025-10-17 05:19:03.06+07
5	5	Finance Admin	Mengelola keuangan	2025-10-17 05:19:32.902+07	2025-10-17 05:19:32.902+07
6	6	Inventory Staff	Stok opname & gudang	2025-10-17 05:19:58.257+07	2025-10-17 05:20:10.212+07
7	7	Admin		2025-10-17 17:31:47.108+07	2025-10-17 17:31:47.108+07
8	8	Admin 1	Admin Inti\n	2025-10-17 17:39:08.763+07	2025-10-17 17:39:08.763+07
\.


--
-- TOC entry 5214 (class 0 OID 24740)
-- Dependencies: 228
-- Data for Name: user_role_mappings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_role_mappings (id, "applicationId", "branchId", "roleId", "userId", status, "createdAt", "updatedAt") FROM stdin;
\.


--
-- TOC entry 5212 (class 0 OID 24724)
-- Dependencies: 226
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, "userName", "fullName", email, status, "createdAt", "updatedAt", password) FROM stdin;
14	fufu	fafa	fufa@gmail.com	t	2025-11-13 17:03:04.263+07	2025-11-13 17:09:15.273+07	$2b$10$26NhEJlx37eMrHyScZyhdeNxstkpEBIxfsT5bWXKLw1S3roUDNq4W
\.


--
-- TOC entry 5230 (class 0 OID 0)
-- Dependencies: 219
-- Name: applications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.applications_id_seq', 9, true);


--
-- TOC entry 5231 (class 0 OID 0)
-- Dependencies: 221
-- Name: branches_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.branches_id_seq', 8, true);


--
-- TOC entry 5232 (class 0 OID 0)
-- Dependencies: 229
-- Name: packages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.packages_id_seq', 19, true);


--
-- TOC entry 5233 (class 0 OID 0)
-- Dependencies: 223
-- Name: roles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.roles_id_seq', 8, true);


--
-- TOC entry 5234 (class 0 OID 0)
-- Dependencies: 227
-- Name: user_role_mappings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.user_role_mappings_id_seq', 12, true);


--
-- TOC entry 5235 (class 0 OID 0)
-- Dependencies: 225
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 15, true);


--
-- TOC entry 4891 (class 2606 OID 24684)
-- Name: applications applications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT applications_pkey PRIMARY KEY (id);


--
-- TOC entry 4893 (class 2606 OID 24698)
-- Name: branches branches_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.branches
    ADD CONSTRAINT branches_pkey PRIMARY KEY (id);


--
-- TOC entry 5017 (class 2606 OID 31417)
-- Name: packages packages_noResi_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.packages
    ADD CONSTRAINT "packages_noResi_key" UNIQUE ("noResi");


--
-- TOC entry 5019 (class 2606 OID 31419)
-- Name: packages packages_noResi_key1; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.packages
    ADD CONSTRAINT "packages_noResi_key1" UNIQUE ("noResi");


--
-- TOC entry 5021 (class 2606 OID 31429)
-- Name: packages packages_noResi_key10; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.packages
    ADD CONSTRAINT "packages_noResi_key10" UNIQUE ("noResi");


--
-- TOC entry 5023 (class 2606 OID 31407)
-- Name: packages packages_noResi_key11; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.packages
    ADD CONSTRAINT "packages_noResi_key11" UNIQUE ("noResi");


--
-- TOC entry 5025 (class 2606 OID 31431)
-- Name: packages packages_noResi_key12; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.packages
    ADD CONSTRAINT "packages_noResi_key12" UNIQUE ("noResi");


--
-- TOC entry 5027 (class 2606 OID 31405)
-- Name: packages packages_noResi_key13; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.packages
    ADD CONSTRAINT "packages_noResi_key13" UNIQUE ("noResi");


--
-- TOC entry 5029 (class 2606 OID 31433)
-- Name: packages packages_noResi_key14; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.packages
    ADD CONSTRAINT "packages_noResi_key14" UNIQUE ("noResi");


--
-- TOC entry 5031 (class 2606 OID 31435)
-- Name: packages packages_noResi_key15; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.packages
    ADD CONSTRAINT "packages_noResi_key15" UNIQUE ("noResi");


--
-- TOC entry 5033 (class 2606 OID 31403)
-- Name: packages packages_noResi_key16; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.packages
    ADD CONSTRAINT "packages_noResi_key16" UNIQUE ("noResi");


--
-- TOC entry 5035 (class 2606 OID 31421)
-- Name: packages packages_noResi_key2; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.packages
    ADD CONSTRAINT "packages_noResi_key2" UNIQUE ("noResi");


--
-- TOC entry 5037 (class 2606 OID 31415)
-- Name: packages packages_noResi_key3; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.packages
    ADD CONSTRAINT "packages_noResi_key3" UNIQUE ("noResi");


--
-- TOC entry 5039 (class 2606 OID 31413)
-- Name: packages packages_noResi_key4; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.packages
    ADD CONSTRAINT "packages_noResi_key4" UNIQUE ("noResi");


--
-- TOC entry 5041 (class 2606 OID 31423)
-- Name: packages packages_noResi_key5; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.packages
    ADD CONSTRAINT "packages_noResi_key5" UNIQUE ("noResi");


--
-- TOC entry 5043 (class 2606 OID 31411)
-- Name: packages packages_noResi_key6; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.packages
    ADD CONSTRAINT "packages_noResi_key6" UNIQUE ("noResi");


--
-- TOC entry 5045 (class 2606 OID 31425)
-- Name: packages packages_noResi_key7; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.packages
    ADD CONSTRAINT "packages_noResi_key7" UNIQUE ("noResi");


--
-- TOC entry 5047 (class 2606 OID 31409)
-- Name: packages packages_noResi_key8; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.packages
    ADD CONSTRAINT "packages_noResi_key8" UNIQUE ("noResi");


--
-- TOC entry 5049 (class 2606 OID 31427)
-- Name: packages packages_noResi_key9; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.packages
    ADD CONSTRAINT "packages_noResi_key9" UNIQUE ("noResi");


--
-- TOC entry 5051 (class 2606 OID 28447)
-- Name: packages packages_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.packages
    ADD CONSTRAINT packages_pkey PRIMARY KEY (id);


--
-- TOC entry 4895 (class 2606 OID 24717)
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


--
-- TOC entry 5013 (class 2606 OID 24753)
-- Name: user_role_mappings user_role_mappings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_role_mappings
    ADD CONSTRAINT user_role_mappings_pkey PRIMARY KEY (id);


--
-- TOC entry 5015 (class 2606 OID 24755)
-- Name: user_role_mappings user_role_mappings_roleId_userId_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_role_mappings
    ADD CONSTRAINT "user_role_mappings_roleId_userId_key" UNIQUE ("roleId", "userId");


--
-- TOC entry 4897 (class 2606 OID 24736)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 4899 (class 2606 OID 31321)
-- Name: users users_userName_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_userName_key" UNIQUE ("userName");


--
-- TOC entry 4901 (class 2606 OID 31323)
-- Name: users users_userName_key1; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_userName_key1" UNIQUE ("userName");


--
-- TOC entry 4903 (class 2606 OID 31295)
-- Name: users users_userName_key10; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_userName_key10" UNIQUE ("userName");


--
-- TOC entry 4905 (class 2606 OID 31313)
-- Name: users users_userName_key11; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_userName_key11" UNIQUE ("userName");


--
-- TOC entry 4907 (class 2606 OID 31301)
-- Name: users users_userName_key12; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_userName_key12" UNIQUE ("userName");


--
-- TOC entry 4909 (class 2606 OID 31311)
-- Name: users users_userName_key13; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_userName_key13" UNIQUE ("userName");


--
-- TOC entry 4911 (class 2606 OID 31303)
-- Name: users users_userName_key14; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_userName_key14" UNIQUE ("userName");


--
-- TOC entry 4913 (class 2606 OID 31309)
-- Name: users users_userName_key15; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_userName_key15" UNIQUE ("userName");


--
-- TOC entry 4915 (class 2606 OID 31307)
-- Name: users users_userName_key16; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_userName_key16" UNIQUE ("userName");


--
-- TOC entry 4917 (class 2606 OID 31305)
-- Name: users users_userName_key17; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_userName_key17" UNIQUE ("userName");


--
-- TOC entry 4919 (class 2606 OID 31297)
-- Name: users users_userName_key18; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_userName_key18" UNIQUE ("userName");


--
-- TOC entry 4921 (class 2606 OID 31299)
-- Name: users users_userName_key19; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_userName_key19" UNIQUE ("userName");


--
-- TOC entry 4923 (class 2606 OID 31325)
-- Name: users users_userName_key2; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_userName_key2" UNIQUE ("userName");


--
-- TOC entry 4925 (class 2606 OID 31327)
-- Name: users users_userName_key20; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_userName_key20" UNIQUE ("userName");


--
-- TOC entry 4927 (class 2606 OID 31275)
-- Name: users users_userName_key21; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_userName_key21" UNIQUE ("userName");


--
-- TOC entry 4929 (class 2606 OID 31329)
-- Name: users users_userName_key22; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_userName_key22" UNIQUE ("userName");


--
-- TOC entry 4931 (class 2606 OID 31331)
-- Name: users users_userName_key23; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_userName_key23" UNIQUE ("userName");


--
-- TOC entry 4933 (class 2606 OID 31273)
-- Name: users users_userName_key24; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_userName_key24" UNIQUE ("userName");


--
-- TOC entry 4935 (class 2606 OID 31271)
-- Name: users users_userName_key25; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_userName_key25" UNIQUE ("userName");


--
-- TOC entry 4937 (class 2606 OID 31333)
-- Name: users users_userName_key26; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_userName_key26" UNIQUE ("userName");


--
-- TOC entry 4939 (class 2606 OID 31269)
-- Name: users users_userName_key27; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_userName_key27" UNIQUE ("userName");


--
-- TOC entry 4941 (class 2606 OID 31335)
-- Name: users users_userName_key28; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_userName_key28" UNIQUE ("userName");


--
-- TOC entry 4943 (class 2606 OID 31337)
-- Name: users users_userName_key29; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_userName_key29" UNIQUE ("userName");


--
-- TOC entry 4945 (class 2606 OID 31277)
-- Name: users users_userName_key3; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_userName_key3" UNIQUE ("userName");


--
-- TOC entry 4947 (class 2606 OID 31339)
-- Name: users users_userName_key30; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_userName_key30" UNIQUE ("userName");


--
-- TOC entry 4949 (class 2606 OID 31267)
-- Name: users users_userName_key31; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_userName_key31" UNIQUE ("userName");


--
-- TOC entry 4951 (class 2606 OID 31341)
-- Name: users users_userName_key32; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_userName_key32" UNIQUE ("userName");


--
-- TOC entry 4953 (class 2606 OID 31265)
-- Name: users users_userName_key33; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_userName_key33" UNIQUE ("userName");


--
-- TOC entry 4955 (class 2606 OID 31263)
-- Name: users users_userName_key34; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_userName_key34" UNIQUE ("userName");


--
-- TOC entry 4957 (class 2606 OID 31343)
-- Name: users users_userName_key35; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_userName_key35" UNIQUE ("userName");


--
-- TOC entry 4959 (class 2606 OID 31281)
-- Name: users users_userName_key36; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_userName_key36" UNIQUE ("userName");


--
-- TOC entry 4961 (class 2606 OID 31283)
-- Name: users users_userName_key37; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_userName_key37" UNIQUE ("userName");


--
-- TOC entry 4963 (class 2606 OID 31349)
-- Name: users users_userName_key38; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_userName_key38" UNIQUE ("userName");


--
-- TOC entry 4965 (class 2606 OID 31261)
-- Name: users users_userName_key39; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_userName_key39" UNIQUE ("userName");


--
-- TOC entry 4967 (class 2606 OID 31279)
-- Name: users users_userName_key4; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_userName_key4" UNIQUE ("userName");


--
-- TOC entry 4969 (class 2606 OID 31351)
-- Name: users users_userName_key40; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_userName_key40" UNIQUE ("userName");


--
-- TOC entry 4971 (class 2606 OID 31353)
-- Name: users users_userName_key41; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_userName_key41" UNIQUE ("userName");


--
-- TOC entry 4973 (class 2606 OID 31355)
-- Name: users users_userName_key42; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_userName_key42" UNIQUE ("userName");


--
-- TOC entry 4975 (class 2606 OID 31259)
-- Name: users users_userName_key43; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_userName_key43" UNIQUE ("userName");


--
-- TOC entry 4977 (class 2606 OID 31347)
-- Name: users users_userName_key44; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_userName_key44" UNIQUE ("userName");


--
-- TOC entry 4979 (class 2606 OID 31357)
-- Name: users users_userName_key45; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_userName_key45" UNIQUE ("userName");


--
-- TOC entry 4981 (class 2606 OID 31345)
-- Name: users users_userName_key46; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_userName_key46" UNIQUE ("userName");


--
-- TOC entry 4983 (class 2606 OID 31359)
-- Name: users users_userName_key47; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_userName_key47" UNIQUE ("userName");


--
-- TOC entry 4985 (class 2606 OID 31289)
-- Name: users users_userName_key48; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_userName_key48" UNIQUE ("userName");


--
-- TOC entry 4987 (class 2606 OID 31361)
-- Name: users users_userName_key49; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_userName_key49" UNIQUE ("userName");


--
-- TOC entry 4989 (class 2606 OID 31319)
-- Name: users users_userName_key5; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_userName_key5" UNIQUE ("userName");


--
-- TOC entry 4991 (class 2606 OID 31363)
-- Name: users users_userName_key50; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_userName_key50" UNIQUE ("userName");


--
-- TOC entry 4993 (class 2606 OID 31287)
-- Name: users users_userName_key51; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_userName_key51" UNIQUE ("userName");


--
-- TOC entry 4995 (class 2606 OID 31365)
-- Name: users users_userName_key52; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_userName_key52" UNIQUE ("userName");


--
-- TOC entry 4997 (class 2606 OID 31285)
-- Name: users users_userName_key53; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_userName_key53" UNIQUE ("userName");


--
-- TOC entry 4999 (class 2606 OID 31367)
-- Name: users users_userName_key54; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_userName_key54" UNIQUE ("userName");


--
-- TOC entry 5001 (class 2606 OID 31369)
-- Name: users users_userName_key55; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_userName_key55" UNIQUE ("userName");


--
-- TOC entry 5003 (class 2606 OID 31257)
-- Name: users users_userName_key56; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_userName_key56" UNIQUE ("userName");


--
-- TOC entry 5005 (class 2606 OID 31291)
-- Name: users users_userName_key6; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_userName_key6" UNIQUE ("userName");


--
-- TOC entry 5007 (class 2606 OID 31317)
-- Name: users users_userName_key7; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_userName_key7" UNIQUE ("userName");


--
-- TOC entry 5009 (class 2606 OID 31293)
-- Name: users users_userName_key8; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_userName_key8" UNIQUE ("userName");


--
-- TOC entry 5011 (class 2606 OID 31315)
-- Name: users users_userName_key9; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_userName_key9" UNIQUE ("userName");


--
-- TOC entry 5052 (class 2606 OID 31238)
-- Name: branches branches_applicationId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.branches
    ADD CONSTRAINT "branches_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES public.applications(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5053 (class 2606 OID 31246)
-- Name: roles roles_branchId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT "roles_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES public.branches(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5054 (class 2606 OID 31376)
-- Name: user_role_mappings user_role_mappings_applicationId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_role_mappings
    ADD CONSTRAINT "user_role_mappings_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES public.applications(id) ON UPDATE CASCADE;


--
-- TOC entry 5055 (class 2606 OID 31381)
-- Name: user_role_mappings user_role_mappings_branchId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_role_mappings
    ADD CONSTRAINT "user_role_mappings_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES public.branches(id) ON UPDATE CASCADE;


--
-- TOC entry 5056 (class 2606 OID 31386)
-- Name: user_role_mappings user_role_mappings_roleId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_role_mappings
    ADD CONSTRAINT "user_role_mappings_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES public.roles(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5057 (class 2606 OID 31391)
-- Name: user_role_mappings user_role_mappings_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_role_mappings
    ADD CONSTRAINT "user_role_mappings_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5223 (class 0 OID 0)
-- Dependencies: 5
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


-- Completed on 2025-11-13 22:58:12

--
-- PostgreSQL database dump complete
--

\unrestrict nw8NmA3hzTe3Lf8rHIiTD5zBrU3aTfSf4hpPL0GGogmJVbQG6jC0mqCAbgZkLcw

