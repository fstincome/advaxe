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
      article_tags: {
        Row: {
          article_id: string
          tag_id: string
        }
        Insert: {
          article_id: string
          tag_id: string
        }
        Update: {
          article_id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "article_tags_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "article_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
        ]
      }
      articles: {
        Row: {
          author: string
          category: string | null
          cover_image_url: string | null
          created_at: string
          featured: boolean
          id: string
          published_at: string | null
          reading_time: number
          seo_description: string | null
          seo_title: string | null
          slug: string
          sort_order: number
          status: string
          updated_at: string
        }
        Insert: {
          author?: string
          category?: string | null
          cover_image_url?: string | null
          created_at?: string
          featured?: boolean
          id?: string
          published_at?: string | null
          reading_time?: number
          seo_description?: string | null
          seo_title?: string | null
          slug: string
          sort_order?: number
          status?: string
          updated_at?: string
        }
        Update: {
          author?: string
          category?: string | null
          cover_image_url?: string | null
          created_at?: string
          featured?: boolean
          id?: string
          published_at?: string | null
          reading_time?: number
          seo_description?: string | null
          seo_title?: string | null
          slug?: string
          sort_order?: number
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      audit_log: {
        Row: {
          action: string
          actor_id: string
          created_at: string
          entity_id: string | null
          entity_type: string
          id: string
          metadata: Json
        }
        Insert: {
          action: string
          actor_id: string
          created_at?: string
          entity_id?: string | null
          entity_type: string
          id?: string
          metadata?: Json
        }
        Update: {
          action?: string
          actor_id?: string
          created_at?: string
          entity_id?: string | null
          entity_type?: string
          id?: string
          metadata?: Json
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
      community_contributions: {
        Row: {
          contribution_type: string
          created_at: string
          end_date: string | null
          external_url: string | null
          id: string
          image_url: string | null
          organization: string
          role: string | null
          slug: string
          sort_order: number
          start_date: string | null
          status: string
          updated_at: string
        }
        Insert: {
          contribution_type: string
          created_at?: string
          end_date?: string | null
          external_url?: string | null
          id?: string
          image_url?: string | null
          organization: string
          role?: string | null
          slug: string
          sort_order?: number
          start_date?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          contribution_type?: string
          created_at?: string
          end_date?: string | null
          external_url?: string | null
          id?: string
          image_url?: string | null
          organization?: string
          role?: string | null
          slug?: string
          sort_order?: number
          start_date?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      contact_messages: {
        Row: {
          created_at: string
          email: string
          id: string
          inquiry_type: string
          is_read: boolean
          lang: string
          message: string
          name: string
          subject: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          inquiry_type?: string
          is_read?: boolean
          lang?: string
          message: string
          name: string
          subject?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          inquiry_type?: string
          is_read?: boolean
          lang?: string
          message?: string
          name?: string
          subject?: string | null
        }
        Relationships: []
      }
      content_translations: {
        Row: {
          entity_id: string
          entity_type: string
          field_name: string
          id: string
          lang: string
          updated_at: string
          value: string
        }
        Insert: {
          entity_id: string
          entity_type: string
          field_name: string
          id?: string
          lang: string
          updated_at?: string
          value?: string
        }
        Update: {
          entity_id?: string
          entity_type?: string
          field_name?: string
          id?: string
          lang?: string
          updated_at?: string
          value?: string
        }
        Relationships: []
      }
      experiences: {
        Row: {
          company: string
          company_url: string | null
          created_at: string | null
          description: Json
          end_date: string | null
          id: string
          is_current: boolean
          location: string | null
          logo_url: string | null
          period: string
          sort_order: number | null
          start_date: string | null
          technologies: string[]
          title: Json
          updated_at: string | null
        }
        Insert: {
          company: string
          company_url?: string | null
          created_at?: string | null
          description?: Json
          end_date?: string | null
          id?: string
          is_current?: boolean
          location?: string | null
          logo_url?: string | null
          period: string
          sort_order?: number | null
          start_date?: string | null
          technologies?: string[]
          title?: Json
          updated_at?: string | null
        }
        Update: {
          company?: string
          company_url?: string | null
          created_at?: string | null
          description?: Json
          end_date?: string | null
          id?: string
          is_current?: boolean
          location?: string | null
          logo_url?: string | null
          period?: string
          sort_order?: number | null
          start_date?: string | null
          technologies?: string[]
          title?: Json
          updated_at?: string | null
        }
        Relationships: []
      }
      expertise_categories: {
        Row: {
          created_at: string
          icon: string | null
          id: string
          slug: string
          sort_order: number
          updated_at: string
          visible: boolean
        }
        Insert: {
          created_at?: string
          icon?: string | null
          id?: string
          slug: string
          sort_order?: number
          updated_at?: string
          visible?: boolean
        }
        Update: {
          created_at?: string
          icon?: string | null
          id?: string
          slug?: string
          sort_order?: number
          updated_at?: string
          visible?: boolean
        }
        Relationships: []
      }
      expertise_items: {
        Row: {
          category_id: string
          created_at: string
          id: string
          sort_order: number
          visible: boolean
        }
        Insert: {
          category_id: string
          created_at?: string
          id?: string
          sort_order?: number
          visible?: boolean
        }
        Update: {
          category_id?: string
          created_at?: string
          id?: string
          sort_order?: number
          visible?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "expertise_items_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "expertise_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      media_appearances: {
        Row: {
          appearance_date: string | null
          created_at: string
          duration: string | null
          external_url: string
          featured: boolean
          id: string
          image_url: string | null
          media_type: string
          publisher: string | null
          slug: string
          sort_order: number
          status: string
          updated_at: string
        }
        Insert: {
          appearance_date?: string | null
          created_at?: string
          duration?: string | null
          external_url: string
          featured?: boolean
          id?: string
          image_url?: string | null
          media_type: string
          publisher?: string | null
          slug: string
          sort_order?: number
          status?: string
          updated_at?: string
        }
        Update: {
          appearance_date?: string | null
          created_at?: string
          duration?: string | null
          external_url?: string
          featured?: boolean
          id?: string
          image_url?: string | null
          media_type?: string
          publisher?: string | null
          slug?: string
          sort_order?: number
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      media_assets: {
        Row: {
          alt_text: string | null
          created_at: string
          file_name: string
          file_size: number
          id: string
          mime_type: string
          storage_path: string
          uploaded_by: string | null
        }
        Insert: {
          alt_text?: string | null
          created_at?: string
          file_name: string
          file_size?: number
          id?: string
          mime_type: string
          storage_path: string
          uploaded_by?: string | null
        }
        Update: {
          alt_text?: string | null
          created_at?: string
          file_name?: string
          file_size?: number
          id?: string
          mime_type?: string
          storage_path?: string
          uploaded_by?: string | null
        }
        Relationships: []
      }
      pages: {
        Row: {
          canonical_url: string | null
          created_at: string
          id: string
          og_image_url: string | null
          page_key: string
          seo_description: string | null
          seo_title: string | null
          slug: string
          sort_order: number
          status: string
          updated_at: string
          visible: boolean
        }
        Insert: {
          canonical_url?: string | null
          created_at?: string
          id?: string
          og_image_url?: string | null
          page_key: string
          seo_description?: string | null
          seo_title?: string | null
          slug: string
          sort_order?: number
          status?: string
          updated_at?: string
          visible?: boolean
        }
        Update: {
          canonical_url?: string | null
          created_at?: string
          id?: string
          og_image_url?: string | null
          page_key?: string
          seo_description?: string | null
          seo_title?: string | null
          slug?: string
          sort_order?: number
          status?: string
          updated_at?: string
          visible?: boolean
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
      project_categories: {
        Row: {
          created_at: string
          id: string
          slug: string
          sort_order: number
          visible: boolean
        }
        Insert: {
          created_at?: string
          id?: string
          slug: string
          sort_order?: number
          visible?: boolean
        }
        Update: {
          created_at?: string
          id?: string
          slug?: string
          sort_order?: number
          visible?: boolean
        }
        Relationships: []
      }
      project_technologies: {
        Row: {
          project_id: string
          technology_id: string
        }
        Insert: {
          project_id: string
          technology_id: string
        }
        Update: {
          project_id?: string
          technology_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_technologies_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_technologies_technology_id_fkey"
            columns: ["technology_id"]
            isOneToOne: false
            referencedRelation: "technologies"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          approach: string | null
          category: string | null
          created_at: string
          current_status: string | null
          demo_url: string | null
          description: Json | null
          featured: boolean
          github_url: string | null
          id: string
          image_url: string | null
          impact: string | null
          problem: string | null
          project_url: string | null
          project_year: number | null
          role: string | null
          slug: string | null
          sort_order: number | null
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          approach?: string | null
          category?: string | null
          created_at?: string
          current_status?: string | null
          demo_url?: string | null
          description?: Json | null
          featured?: boolean
          github_url?: string | null
          id?: string
          image_url?: string | null
          impact?: string | null
          problem?: string | null
          project_url?: string | null
          project_year?: number | null
          role?: string | null
          slug?: string | null
          sort_order?: number | null
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          approach?: string | null
          category?: string | null
          created_at?: string
          current_status?: string | null
          demo_url?: string | null
          description?: Json | null
          featured?: boolean
          github_url?: string | null
          id?: string
          image_url?: string | null
          impact?: string | null
          problem?: string | null
          project_url?: string | null
          project_year?: number | null
          role?: string | null
          slug?: string | null
          sort_order?: number | null
          status?: string
          title?: string
          updated_at?: string
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
      site_settings: {
        Row: {
          id: string
          is_public: boolean
          setting_key: string
          updated_at: string
          value: string
        }
        Insert: {
          id?: string
          is_public?: boolean
          setting_key: string
          updated_at?: string
          value?: string
        }
        Update: {
          id?: string
          is_public?: boolean
          setting_key?: string
          updated_at?: string
          value?: string
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
      speaking_events: {
        Row: {
          created_at: string
          event_date: string
          event_type: string
          external_url: string | null
          id: string
          image_url: string | null
          location: string | null
          resource_url: string | null
          role: string | null
          slug: string
          sort_order: number
          status: string
          updated_at: string
          video_url: string | null
        }
        Insert: {
          created_at?: string
          event_date: string
          event_type?: string
          external_url?: string | null
          id?: string
          image_url?: string | null
          location?: string | null
          resource_url?: string | null
          role?: string | null
          slug: string
          sort_order?: number
          status?: string
          updated_at?: string
          video_url?: string | null
        }
        Update: {
          created_at?: string
          event_date?: string
          event_type?: string
          external_url?: string | null
          id?: string
          image_url?: string | null
          location?: string | null
          resource_url?: string | null
          role?: string | null
          slug?: string
          sort_order?: number
          status?: string
          updated_at?: string
          video_url?: string | null
        }
        Relationships: []
      }
      tags: {
        Row: {
          id: string
          name: string
          slug: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      technologies: {
        Row: {
          category: string | null
          id: string
          name: string
          slug: string
          sort_order: number
          website_url: string | null
        }
        Insert: {
          category?: string | null
          id?: string
          name: string
          slug: string
          sort_order?: number
          website_url?: string | null
        }
        Update: {
          category?: string | null
          id?: string
          name?: string
          slug?: string
          sort_order?: number
          website_url?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
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
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "editor"
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
    Enums: {
      app_role: ["admin", "editor"],
    },
  },
} as const
