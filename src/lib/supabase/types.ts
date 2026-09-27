// Tipe database Supabase — dihasilkan dari skema (generate_typescript_types). Jangan diedit manual.

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.5";
  };
  public: {
    Tables: {
      activity_log: {
        Row: {
          duration_sec: number;
          event: string | null;
          family_id: string;
          id: string;
          member_id: string;
          part_id: string | null;
          progress_pct: number | null;
          started_at: string;
          tool_id: string;
        };
        Insert: {
          duration_sec?: number;
          event?: string | null;
          family_id: string;
          id?: string;
          member_id: string;
          part_id?: string | null;
          progress_pct?: number | null;
          started_at?: string;
          tool_id: string;
        };
        Update: {
          duration_sec?: number;
          event?: string | null;
          family_id?: string;
          id?: string;
          member_id?: string;
          part_id?: string | null;
          progress_pct?: number | null;
          started_at?: string;
          tool_id?: string;
        };
        Relationships: [];
      };
      family: {
        Row: { created_at: string; created_by: string; id: string; name: string };
        Insert: { created_at?: string; created_by?: string; id?: string; name: string };
        Update: { created_at?: string; created_by?: string; id?: string; name?: string };
        Relationships: [];
      };
      family_user: {
        Row: { created_at: string; family_id: string; user_id: string };
        Insert: { created_at?: string; family_id: string; user_id: string };
        Update: { created_at?: string; family_id?: string; user_id?: string };
        Relationships: [];
      };
      game_save: {
        Row: { data: Json; family_id: string; key: string; member_id: string | null; updated_at: string };
        Insert: { data: Json; family_id: string; key: string; member_id?: string | null; updated_at?: string };
        Update: { data?: Json; family_id?: string; key?: string; member_id?: string | null; updated_at?: string };
        Relationships: [];
      };
      member: {
        Row: {
          color_key: string;
          created_at: string;
          family_id: string;
          has_pin: boolean | null;
          id: string;
          is_admin: boolean;
          name: string;
          pin_hash: string | null;
          sort: number;
        };
        Insert: {
          color_key: string;
          created_at?: string;
          family_id: string;
          has_pin?: boolean | null;
          id?: string;
          is_admin?: boolean;
          name: string;
          pin_hash?: string | null;
          sort?: number;
        };
        Update: {
          color_key?: string;
          created_at?: string;
          family_id?: string;
          has_pin?: boolean | null;
          id?: string;
          is_admin?: boolean;
          name?: string;
          pin_hash?: string | null;
          sort?: number;
        };
        Relationships: [];
      };
      member_permission: {
        Row: { key: string; member_id: string };
        Insert: { key: string; member_id: string };
        Update: { key?: string; member_id?: string };
        Relationships: [];
      };
    };
    Views: { [_ in never]: never };
    Functions: {
      create_family: {
        Args: { p_admin_name: string; p_color: string; p_family_name: string; p_pin?: string };
        Returns: string;
      };
      is_family_user: { Args: { fid: string }; Returns: boolean };
      make_admin: { Args: { p_member: string }; Returns: undefined };
      set_member_pin: { Args: { p_member: string; p_pin: string | null }; Returns: undefined };
      verify_member_pin: { Args: { p_member: string; p_pin: string }; Returns: boolean };
    };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
};
