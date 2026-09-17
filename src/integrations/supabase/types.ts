export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      activity_logs: {
        Row: {
          action: string
          category: string | null
          created_at: string | null
          details: Json | null
          id: string
          ip_address: string | null
        }
        Insert: {
          action: string
          category?: string | null
          created_at?: string | null
          details?: Json | null
          id?: string
          ip_address?: string | null
        }
        Update: {
          action?: string
          category?: string | null
          created_at?: string | null
          details?: Json | null
          id?: string
          ip_address?: string | null
        }
        Relationships: []
      }
      click_tracking: {
        Row: {
          created_at: string | null
          element: string
          id: string
          page: string | null
          visitor_id: string | null
        }
        Insert: {
          created_at?: string | null
          element: string
          id?: string
          page?: string | null
          visitor_id?: string | null
        }
        Update: {
          created_at?: string | null
          element?: string
          id?: string
          page?: string | null
          visitor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "click_tracking_visitor_id_fkey"
            columns: ["visitor_id"]
            isOneToOne: false
            referencedRelation: "visitors"
            referencedColumns: ["id"]
          },
        ]
      }
      experiences: {
        Row: {
          company: string
          company_url: string | null
          created_at: string | null
          description: Json
          id: string
          period: string
          sort_order: number | null
          title: Json
          updated_at: string | null
        }
        Insert: {
          company: string
          company_url?: string | null
          created_at?: string | null
          description?: Json
          id?: string
          period: string
          sort_order?: number | null
          title?: Json
          updated_at?: string | null
        }
        Update: {
          company?: string
          company_url?: string | null
          created_at?: string | null
          description?: Json
          id?: string
          period?: string
          sort_order?: number | null
          title?: Json
          updated_at?: string | null
        }
        Relationships: []
      }
      personal_info: {
        Row: {
          id: string
          info_key: string
          updated_at: string | null
          value: string
        }
        Insert: {
          id?: string
          info_key: string
          updated_at?: string | null
          value?: string
        }
        Update: {
          id?: string
          info_key?: string
          updated_at?: string | null
          value?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          category: string | null
          description: Json | null
          id: string
          image_url: string | null
          project_url: string | null
          sort_order: number | null
          title: string
        }
        Insert: {
          category?: string | null
          description?: Json | null
          id?: string
          image_url?: string | null
          project_url?: string | null
          sort_order?: number | null
          title: string
        }
        Update: {
          category?: string | null
          description?: Json | null
          id?: string
          image_url?: string | null
          project_url?: string | null
          sort_order?: number | null
          title?: string
        }
        Relationships: []
      }
      services: {
        Row: {
          description: Json
          icon: string | null
          id: string
          sort_order: number | null
          title: Json
        }
        Insert: {
          description?: Json
          icon?: string | null
          id?: string
          sort_order?: number | null
          title?: Json
        }
        Update: {
          description?: Json
          icon?: string | null
          id?: string
          sort_order?: number | null
          title?: Json
        }
        Relationships: []
      }
      site_content: {
        Row: {
          content: string
          id: string
          lang: string
          section_key: string
          updated_at: string | null
        }
        Insert: {
          content?: string
          id?: string
          lang?: string
          section_key: string
          updated_at?: string | null
        }
        Update: {
          content?: string
          id?: string
          lang?: string
          section_key?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      skills: {
        Row: {
          id: string
          name: string
          percentage: number
          sort_order: number | null
        }
        Insert: {
          id?: string
          name: string
          percentage?: number
          sort_order?: number | null
        }
        Update: {
          id?: string
          name?: string
          percentage?: number
          sort_order?: number | null
        }
        Relationships: []
      }
      social_links: {
        Row: {
          icon: string | null
          id: string
          platform: string
          sort_order: number | null
          url: string
        }
        Insert: {
          icon?: string | null
          id?: string
          platform: string
          sort_order?: number | null
          url: string
        }
        Update: {
          icon?: string | null
          id?: string
          platform?: string
          sort_order?: number | null
          url?: string
        }
        Relationships: []
      }
      visitors: {
        Row: {
          city: string | null
          continent: string | null
          country: string | null
          created_at: string | null
          id: string
          ip_address: string | null
          page_visited: string | null
          referrer: string | null
          user_agent: string | null
        }
        Insert: {
          city?: string | null
          continent?: string | null
          country?: string | null
          created_at?: string | null
          id?: string
          ip_address?: string | null
          page_visited?: string | null
          referrer?: string | null
          user_agent?: string | null
        }
        Update: {
          city?: string | null
          continent?: string | null
          country?: string | null
          created_at?: string | null
          id?: string
          ip_address?: string | null
          page_visited?: string | null
          referrer?: string | null
          user_agent?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
