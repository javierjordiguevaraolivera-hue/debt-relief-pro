-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.debt-leads (
  first_name text,
  last_name text,
  email text,
  phone text,
  mobile text,
  address1 text,
  city text,
  state text,
  zipcode text,
  total_debt_amount text,
  dob date,
  ssn text,
  funnel_id text,
  domain text,
  source text,
  language text,
  sub1 text,
  sub2 text,
  trustedform_cert_url text,
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  lead_status text DEFAULT 'new'::text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT debt-leads_pkey PRIMARY KEY (id)
);

CREATE TABLE public.debt-leads-metadata (
  lead_id uuid NOT NULL,
  device_id text,
  session_id text,
  sale_path text,
  ip_address text,
  user_agent text,
  referrer_url text,
  landing_url text,
  trustedform_claim_status text,
  trustedform_claimed_at timestamp with time zone,
  trustedform_claim_response jsonb,
  trustedform_claim_error text,
  validation jsonb,
  risk_flags jsonb,
  geo jsonb,
  request_headers jsonb,
  raw_payload jsonb,
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  application_id text,
  CONSTRAINT debt-leads-metadata_pkey PRIMARY KEY (id),
  CONSTRAINT debt-leads-metadata_lead_id_fkey
    FOREIGN KEY (lead_id) REFERENCES public.debt-leads(id)
);

CREATE TABLE public.environment_variables (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  variable_name text UNIQUE,
  variable_value text,
  notes text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT environment_variables_pkey PRIMARY KEY (id)
);

CREATE TABLE public.ringba_call_events (
  lead_id uuid,
  funnel_id text,
  ringba_call_id text,
  event_name text,
  conversion_status text,
  call_duration_seconds integer,
  caller_phone_number text,
  dialed_phone_number text,
  printed_number text,
  payout numeric,
  revenue numeric,
  raw_payload jsonb NOT NULL,
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT ringba_call_events_pkey PRIMARY KEY (id),
  CONSTRAINT ringba_call_events_lead_id_fkey
    FOREIGN KEY (lead_id) REFERENCES public.debt-leads(id)
);
