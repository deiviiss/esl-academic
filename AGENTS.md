# 🤖 Guía para Agentes LLM - Project

> **Propósito**: Este documento es una guía completa para que agentes LLM trabajen eficientemente en este proyecto. Se enfoca en **cómo trabajar**, no en qué hace el proyecto.

---

## 📋 Tabla de Contenidos

1. [Arquitectura y Stack](#-arquitectura-y-stack)
2. [Estructura de Carpetas](#-estructura-de-carpetas)
3. [Patrones de Código](#-patrones-de-código)
4. [Convenciones de Nombres](#-convenciones-de-nombres)
5. [Flujos de Trabajo](#-flujos-de-trabajo)
6. [Buenas Prácticas](#-buenas-prácticas)
7. [Estilos y UI](#-estilos-y-ui)
8. [Estado y Datos](#-estado-y-datos)
9. [Validación y Formularios](#-validación-y-formularios)
10. [Reglas de ESLint](#-reglas-de-eslint)
11. [Comandos Útiles](#-comandos-útiles)

---

## 🏗️ Arquitectura y Stack

### Stack Principal
```
Next.js 15.2.4 (App Router)
├── React 19
├── TypeScript 5.3.3
├── Prisma 6.8.2 (ORM)
├── NextAuth 5.0.0-beta.25 (Autenticación)
├── Zustand 4.5.2 (Estado Global)
├── Shadcn UI + Radix UI (Componentes)
├── Tailwind CSS 3.4.17 (Estilos)
├── React Hook Form 7.54.1 (Formularios)
├── Zod 3.24.1 (Validación)
└── Framer Motion (Animaciones)
```

### Principios Arquitectónicos

1. **Server Components por defecto**: Usa `'use client'` solo cuando sea necesario
2. **Server Actions para mutaciones**: No uses API Routes para CRUD
3. **Validación en ambos lados**: Cliente (UX) y servidor (seguridad)
4. **Estado global mínimo**: Solo para UI (modals, sidebars, preferencias)
5. **Tipos compartidos**: Interfaces en `src/lib/types.ts`

---

## 📁 Estructura de Carpetas

### Regla de Organización: **Por Feature/Dominio**

```
src/
├── actions/           # Server Actions organizadas por feature
│   ├── products/
│   ├── categories/
│   ├── orders/
│   └── [feature]/
│
├── app/              # App Router (rutas)
│   ├── (home)/       # Route Group público
│   ├── admin/        # Área administrativa
│   └── api/          # API Routes (solo cuando sea necesario)
│
├── components/       # Componentes React
│   ├── ui/           # Primitivos de Shadcn UI
│   ├── [feature]/    # Componentes por feature
│   └── *.tsx         # Componentes globales (navbar, footer)
│
├── lib/              # Utilidades y configuraciones
│   ├── prisma.ts     # Singleton de Prisma
│   ├── utils.ts      # Funciones helper
│   └── types.ts      # Tipos compartidos
│
├── schemas/          # Esquemas Zod por entidad
│   ├── user.schema.ts
│   └── [entity].schema.ts
│
├── store/            # Stores de Zustand
│   ├── cart-store.ts
│   └── [store].ts
│
└── auth.ts           # Configuración de NextAuth
```

### Reglas de Ubicación

| Tipo de Archivo | Ubicación | Ejemplo |
|-----------------|-----------|---------|
| Server Action | `src/actions/[feature]/` | `src/actions/users/create-update-user.ts` |
| Componente UI base | `src/components/ui/` | `src/components/ui/button.tsx` |
| Componente de feature | `src/components/[feature]/` | `src/components/users/user-card.tsx` |
| Componente global | `src/components/` | `src/components/navbar.tsx` |
| Página pública | `src/app/(home)/` | `src/app/(home)/page.tsx` |
| Página admin | `src/app/admin/` | `src/app/admin/dashboard/page.tsx` |
| Schema Zod | `src/schemas/` | `src/schemas/user.schema.ts` |
| Store Zustand | `src/store/` | `src/store/ui-store.ts` |
| Tipo compartido | `src/lib/types.ts` | `export interface Product { ... }` |
| Utilidad | `src/lib/utils.ts` | `export function cn(...) { ... }` |

---

## 🎯 Patrones de Código

### 1. Server Actions

**Ubicación**: `src/actions/[feature]/[action-name].ts`

**Patrón Estándar**:
```typescript
'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { userSchema } from '@/schemas/user.schema'

export const createUpdateUser = async (formData: FormData) => {
  // 1. Extraer y transformar datos
  const rawData = Object.fromEntries(formData)
  const data = {
    ...rawData,
    price: Number(rawData.price),
    isAvailable: rawData.isAvailable === 'true'
  }

  // 2. Validar con Zod
  const parsed = productSchema.safeParse(data)
  if (!parsed.success) {
    return { ok: false, message: 'Datos inválidos' }
  }

  // 3. Ejecutar lógica de negocio
  try {
    const result = await prisma.user.create({
      data: parsed.data
    })

    // 4. Revalidar paths afectados
    revalidatePath('/admin/users')
    revalidatePath('/users')

    // 5. Retornar resultado consistente
    return { ok: true, message: 'Usuario creado', user: result }
  } catch (error) {
    return { ok: false, message: 'Error al crear usuario' }
  }
}
```

**Reglas**:
- ✅ Siempre usa `'use server'` directive
- ✅ Valida con Zod antes de ejecutar
- ✅ Retorna `{ ok: boolean, message: string, data?: any }`
- ✅ Usa `revalidatePath()` para invalidar cache
- ✅ Maneja errores con try/catch
- ❌ No uses `console.log()` (usa `console.error()` solo para debugging)

---

### 2. Componentes de Cliente

**Ubicación**: `src/components/[feature]/[component-name].tsx`

**Patrón Estándar**:
```typescript
'use client'

// 1. Imports de librerías externas
import { motion } from 'framer-motion'
import { useState } from 'react'
import { toast } from 'sonner'

// 2. Imports de Server Actions
import { createUser } from '@/actions/users/create-user'

// 3. Imports de componentes
import { Button } from '@/components/ui/button'
import { Dialog } from '@/components/ui/dialog'

// 4. Imports de utilidades y tipos
import { cn } from '@/lib/utils'
import type { User } from '@/lib/types'

// 5. Imports de stores
import { useUiStore } from '@/store'

// 6. Interfaces/Types locales
interface UserCardProps {
  user: User
}

// 7. Componente
export default function UserCard({ user }: UserCardProps) {
  // Estado local
  const [isLoading, setIsLoading] = useState(false)
  
  // Stores
  const { openSidebar } = useUiStore()
  
  // Handlers
  const handleOpenDetails = () => {
    openSidebar()
    toast.success('Detalles abiertos')
  }
  
  // Render
  return (
    <motion.div whileHover={{ y: -5 }}>
      <Button onClick={handleOpenDetails}>
        Ver detalles
      </Button>
    </motion.div>
  )
}
```

**Reglas**:
- ✅ Usa `'use client'` solo cuando sea necesario (estado, eventos, hooks del navegador)
- ✅ Ordena imports: librerías → actions → componentes → utils/tipos → stores
- ✅ Define interfaces antes del componente
- ✅ Usa `export default` para el componente principal
- ✅ Agrupa estado, stores, handlers y render
- ❌ No mezcles lógica de negocio en componentes (usa Server Actions)

---

### 3. Server Components (Páginas)

**Ubicación**: `src/app/[route]/page.tsx`

**Patrón Estándar**:
```typescript
import { Suspense } from 'react'
import Loading from '../loading'
import { getUsers } from '@/actions/users/get-users'
import { getRoles } from '@/actions/roles/get-roles'
import { UserList } from '@/components/users/user-list'

export default async function UsersPage() {
  // Fetch data en paralelo
  const [users, roles] = await Promise.all([
    getUsers(),
    getRoles()
  ])

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Usuarios</h1>
      
      <Suspense fallback={<Loading />}>
        <UserList users={users} roles={roles} />
      </Suspense>
    </main>
  )
}
```

**Reglas**:
- ✅ Usa `async/await` para fetch de datos
- ✅ Usa `Promise.all()` para requests paralelos
- ✅ Envuelve componentes dinámicos en `<Suspense>`
- ✅ Pasa datos como props a componentes de cliente
- ❌ No uses hooks (`useState`, `useEffect`) en Server Components
- ❌ No uses event handlers directamente

---

### 4. Zustand Stores

**Ubicación**: `src/store/[store-name].ts`

**Patrón Estándar**:
```typescript
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Product } from '@/lib/types'

// 1. Define interfaces
interface SidebarItem {
  id: string
  title: string
  isOpen: boolean
}

interface UiState {
  // Estado
  isSidebarOpen: boolean
  sidebarContent: SidebarItem | null
  
  // Acciones
  openSidebar: (content?: SidebarItem) => void
  closeSidebar: () => void
  toggleSidebar: () => void
  setSidebarContent: (content: SidebarItem | null) => void
}

// 2. Crea el store
export const useUiStore = create<UiState>()(
  persist(
    (set, get) => ({
      // Estado inicial
      isSidebarOpen: false,
      sidebarContent: null,

      // Implementación de acciones
      openSidebar: (content) => {
        set({ 
          isSidebarOpen: true,
          sidebarContent: content || null
        })
      },

      closeSidebar: () => {
        set({ 
          isSidebarOpen: false,
          sidebarContent: null
        })
      },

      toggleSidebar: () => {
        set({ isSidebarOpen: !get().isSidebarOpen })
      },

      setSidebarContent: (content) => {
        set({ sidebarContent: content })
      }
    }),
    {
      name: 'ui-storage' // Nombre para localStorage
    }
  )
)
```

**Reglas**:
- ✅ Define interfaces antes del store
- ✅ Usa `persist` middleware para persistencia
- ✅ Agrupa estado, acciones y selectores
- ✅ Usa `get()` para acceder al estado actual
- ✅ Usa `set()` para actualizar estado
- ❌ No mutes el estado directamente
- ❌ No uses lógica asíncrona en el store (usa Server Actions)

---

### 5. Schemas Zod

**Ubicación**: `src/schemas/[entity].schema.ts`

**Patrón Estándar**:
```typescript
import { z } from 'zod'

// Schema anidado (si aplica)
export const optionSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1).max(100),
  price: z.coerce.number().nonnegative(),
  isAvailable: z.boolean().default(true),
  type: z.enum(['size', 'ingredient', 'variable']),
  quantity: z.number().int().nonnegative().optional().default(0)
})

// Schema principal
export const userSchema = z.object({
  id: z.string().uuid().optional(),
  
  name: z
    .string({
      required_error: 'El nombre es requerido.',
      message: 'El nombre debe tener entre 3 y 50 caracteres.'
    })
    .min(3, { message: 'El nombre debe tener al menos 3 caracteres.' })
    .max(50, { message: 'El nombre debe tener máximo 50 caracteres.' }),
  
  email: z
    .string({ required_error: 'El email es requerido.' })
    .email('Email inválido'),
  
  password: z
    .string({ message: 'La contraseña es requerida.' })
    .min(8, { message: 'La contraseña debe tener al menos 8 caracteres.' }),
  
  avatar: z
    .union([
      z.string().url('La imagen es requerida').min(1),
      z.literal('upload_pending') // Valor temporal para validación
    ])
    .optional(),
  
  roleId: z
    .string({ required_error: 'El rol es requerido.' })
    .uuid('Selecciona un rol válido.'),
  
  isActive: z.coerce.boolean().optional().default(true)
})
```

**Reglas**:
- ✅ Usa mensajes de error en español
- ✅ Usa `.coerce` para conversión automática de tipos
- ✅ Usa `.transform()` para transformaciones
- ✅ Define schemas anidados cuando sea necesario
- ✅ Usa `.optional()` y `.default()` apropiadamente
- ❌ No uses validaciones complejas (muévelas a Server Actions)

---

## 📝 Convenciones de Nombres

### Archivos

| Tipo | Convención | Ejemplo |
|------|-----------|---------|
| Componentes | `kebab-case.tsx` | `product-card.tsx` |
| Server Actions | `kebab-case.ts` | `create-update-product.ts` |
| Schemas | `kebab-case.schema.ts` | `product.schema.ts` |
| Stores | `kebab-case-store.ts` | `cart-store.ts` |
| Utilidades | `kebab-case.ts` | `utils.ts` |
| Tipos | `types.ts` | `types.ts` |
| Hooks personalizados | `use-*.tsx` | `use-mobile.tsx` |
| Providers | `PascalCase.tsx` | `Providers.tsx` |

### Código

| Elemento | Convención | Ejemplo |
|----------|-----------|---------|
| Componentes | `PascalCase` | `ProductCard` |
| Funciones | `camelCase` | `handleAddToCart` |
| Variables | `camelCase` | `isLoading` |
| Constantes | `UPPER_SNAKE_CASE` | `MAX_ITEMS` |
| Interfaces | `PascalCase` | `ProductCardProps` |
| Types | `PascalCase` | `OrderStatus` |
| Enums | `PascalCase` | `Role` |

### Server Actions

**Patrón de nombres**: `[verbo]-[entidad]` o `[verbo]-[entidad]-by-[criterio]`

```typescript
// ✅ Correcto
getProducts()
getProductBySlug()
createUpdateProduct()
deleteProduct()
getPaginatedProducts()

// ❌ Incorrecto
products()
fetchProduct()
saveProduct()
```

**Verbos estándar**:
- `get`: Obtener datos
- `create`: Crear nuevo
- `update`: Actualizar existente
- `createUpdate`: Crear o actualizar (upsert)
- `delete`: Eliminar
- `getPaginated`: Obtener con paginación

---

## 🔄 Flujos de Trabajo

### Crear una Nueva Feature

**Ejemplo**: Agregar feature de "Comments" (comentarios)

#### 1. **Definir Tipos** (`src/lib/types.ts`)
```typescript
export interface Comment {
  id: string
  postId: string
  userId: string
  content: string
  createdAt: Date
}
```

#### 2. **Crear Schema** (`src/schemas/comment.schema.ts`)
```typescript
import { z } from 'zod'

export const commentSchema = z.object({
  id: z.string().uuid().optional(),
  postId: z.string().uuid(),
  content: z.string().min(10).max(500)
})
```

#### 3. **Crear Server Actions** (`src/actions/comments/`)
```typescript
// src/actions/comments/create-comment.ts
'use server'

import { prisma } from '@/lib/prisma'
import { commentSchema } from '@/schemas/comment.schema'

export const createComment = async (formData: FormData) => {
  const data = Object.fromEntries(formData)
  const parsed = commentSchema.safeParse(data)
  
  if (!parsed.success) {
    return { ok: false, message: 'Datos inválidos' }
  }
  
  try {
    const comment = await prisma.comment.create({
      data: parsed.data
    })
    
    return { ok: true, message: 'Comentario creado', comment }
  } catch (error) {
    return { ok: false, message: 'Error al crear comentario' }
  }
}
```

#### 4. **Crear Componentes** (`src/components/comments/`)
```typescript
// src/components/comments/comment-form.tsx
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createComment } from '@/actions/comments/create-comment'
import { commentSchema } from '@/schemas/comment.schema'

export function CommentForm({ postId }: { postId: string }) {
  const form = useForm({
    resolver: zodResolver(commentSchema),
    defaultValues: { postId, content: '' }
  })
  
  const onSubmit = async (values) => {
    const formData = new FormData()
    Object.entries(values).forEach(([key, value]) => {
      formData.append(key, String(value))
    })
    
    const { ok, message } = await createComment(formData)
    
    if (ok) {
      toast.success(message)
      form.reset()
    } else {
      toast.error(message)
    }
  }
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {/* Campos del formulario */}
      </form>
    </Form>
  )
}
```

#### 5. **Integrar en Páginas** (`src/app/posts/[slug]/page.tsx`)
```typescript
import { CommentForm } from '@/components/comments/comment-form'
import { getComments } from '@/actions/comments/get-comments'

export default async function PostPage({ params }) {
  const comments = await getComments(params.slug)
  
  return (
    <div>
      {/* Post */}
      <CommentForm postId={params.slug} />
      {/* Lista de comentarios */}
    </div>
  )
}
```

---

### Modificar una Feature Existente

**Ejemplo**: Agregar campo "bio" a usuarios

#### 1. **Actualizar Tipo** (`src/lib/types.ts`)
```typescript
export interface User {
  // ... campos existentes
  bio: string // ✅ Agregar nuevo campo
}
```

#### 2. **Actualizar Schema** (`src/schemas/user.schema.ts`)
```typescript
export const userSchema = z.object({
  // ... campos existentes
  bio: z.string().max(500).optional() // ✅ Agregar validación
})
```

#### 3. **Actualizar Server Actions**
```typescript
// src/actions/users/create-update-user.ts
export const createUpdateUser = async (formData: FormData) => {
  const data = {
    // ... campos existentes
    bio: formData.get('bio') as string // ✅ Extraer nuevo campo
  }
  
  // ... resto del código
}
```

#### 4. **Actualizar Componentes**
```typescript
// src/components/admin/users-tab.tsx
<FormField
  control={form.control}
  name="bio"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Biografía</FormLabel>
      <FormControl>
        <Textarea placeholder="Cuéntanos sobre ti..." {...field} />
      </FormControl>
    </FormItem>
  )}
/>
```

---

## ✅ Buenas Prácticas

### Generales

1. **DRY (Don't Repeat Yourself)**
   ```typescript
   // ❌ Malo
   const total1 = calculateDiscount(user1.subscription, user1.plan)
   const total2 = calculateDiscount(user2.subscription, user2.plan)
   
   // ✅ Bueno
   const getUserDiscount = (user: User) => {
     return calculateDiscount(user.subscription, user.plan)
   }
   ```

2. **Early Returns**
   ```typescript
   // ❌ Malo
   function handleSubmit(data) {
     if (data.isValid) {
       if (data.hasPermission) {
         // lógica compleja
       } else {
         return { error: 'Sin permiso' }
       }
     } else {
       return { error: 'Datos inválidos' }
     }
   }
   
   // ✅ Bueno
   function handleSubmit(data) {
     if (!data.isValid) {
       return { error: 'Datos inválidos' }
     }
     
     if (!data.hasPermission) {
       return { error: 'Sin permiso' }
     }
     
     // lógica compleja
   }
   ```

3. **Destructuring**
   ```typescript
   // ❌ Malo
   function UserCard(props) {
     return <div>{props.user.name}</div>
   }
   
   // ✅ Bueno
   function UserCard({ user }: UserCardProps) {
     const { name, email, avatar } = user
     return <div>{name}</div>
   }
   ```

4. **Optional Chaining**
   ```typescript
   // ❌ Malo
   const role = user && user.profile && user.profile.role && user.profile.role.name
   
   // ✅ Bueno
   const role = user?.profile?.role?.name
   ```

5. **Nullish Coalescing**
   ```typescript
   // ❌ Malo
   const displayName = user.displayName !== undefined ? user.displayName : user.name
   
   // ✅ Bueno
   const displayName = user.displayName ?? user.name
   ```

---

### React/Next.js

1. **Usa Server Components por defecto**
   ```typescript
   // ✅ Server Component (por defecto)
   export default async function UsersPage() {
     const users = await getUsers()
     return <UserList users={users} />
   }
   
   // ✅ Client Component (solo cuando sea necesario)
   'use client'
   export default function UserCard() {
     const [isOpen, setIsOpen] = useState(false)
     return <Dialog open={isOpen} />
   }
   ```

2. **Evita `useEffect` innecesarios**
   ```typescript
   // ❌ Malo
   const [total, setTotal] = useState(0)
   useEffect(() => {
     setTotal(price * quantity)
   }, [price, quantity])
   
   // ✅ Bueno
   const total = price * quantity
   ```

3. **Memoiza solo cuando sea necesario**
   ```typescript
   // ❌ Malo (sobre-optimización)
   const total = useMemo(() => price * quantity, [price, quantity])
   
   // ✅ Bueno (cálculo simple, no necesita memo)
   const total = price * quantity
   
   // ✅ Bueno (cálculo complejo, sí necesita memo)
   const expensiveCalculation = useMemo(() => {
     return items.reduce((acc, item) => {
       // lógica compleja
     }, 0)
   }, [items])
   ```

4. **Usa `Suspense` para loading states**
   ```typescript
   // ✅ Bueno
   <Suspense fallback={<Loading />}>
     <ProductList />
   </Suspense>
   ```

---

### TypeScript

1. **Usa tipos explícitos en funciones públicas**
   ```typescript
   // ❌ Malo
   export function getTotal(items) {
     return items.reduce((sum, item) => sum + item.price, 0)
   }
   
   // ✅ Bueno
   export function getTotal(items: CartItem[]): number {
     return items.reduce((sum, item) => sum + item.price, 0)
   }
   ```

2. **Usa `type` para unions, `interface` para objetos**
   ```typescript
   // ✅ Bueno
   type OrderStatus = 'PENDING' | 'IN_PROGRESS' | 'DELIVERED'
   
   interface Order {
     id: string
     status: OrderStatus
   }
   ```

3. **Evita `any`, usa `unknown` si es necesario**
   ```typescript
   // ❌ Malo
   const data: any = await fetch(...)
   
   // ✅ Bueno
   const data: unknown = await fetch(...)
   if (typeof data === 'object' && data !== null) {
     // type guard
   }
   ```

---

### Performance

1. **Usa `Promise.all()` para requests paralelos**
   ```typescript
   // ❌ Malo (secuencial)
   const users = await getUsers()
   const roles = await getRoles()
   
   // ✅ Bueno (paralelo)
   const [users, roles] = await Promise.all([
     getUsers(),
     getRoles()
   ])
   ```

2. **Revalida paths específicos**
   ```typescript
   // ❌ Malo (revalida todo)
   revalidatePath('/', 'layout')
   
   // ✅ Bueno (revalida solo lo necesario)
   revalidatePath('/users')
   revalidatePath('/admin/users')
   ```

3. **Lazy load componentes pesados**
   ```typescript
   import dynamic from 'next/dynamic'
   
   const HeavyChart = dynamic(() => import('@/components/heavy-chart'), {
     loading: () => <Skeleton />,
     ssr: false
   })
   ```

---

## 🎨 Estilos y UI

### Tailwind CSS

**Principio**: Utility-first, mobile-first

#### Clases Comunes del Proyecto

```typescript
// Contenedores
className="container mx-auto px-4 py-8"

// Cards
className="bg-card rounded-lg shadow-md p-4"

// Botones primarios
className="bg-primary hover:bg-primary/80 text-primary-foreground"

// Botones destructivos
className="bg-destructive hover:bg-destructive/80 text-destructive-foreground"

// Inputs
className="w-full p-2 rounded border"

// Responsive
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"

// Dark mode
className="bg-background text-foreground dark:bg-muted"
```

#### Función `cn()` para Merge de Clases

```typescript
import { cn } from '@/lib/utils'

// ✅ Uso correcto
<div className={cn(
  'base-classes',
  isActive && 'active-classes',
  isDisabled && 'disabled-classes',
  className // Props externas
)}>
```

#### Colores del Sistema

Usa variables CSS definidas en `tailwind.config.ts`:

```typescript
// ✅ Correcto (usa variables del tema)
className="bg-primary text-primary-foreground"
className="bg-destructive text-destructive-foreground"
className="bg-muted text-muted-foreground"

// ❌ Incorrecto (colores hardcodeados)
className="bg-blue-500 text-white"
className="bg-red-600 text-white"
```

**Colores disponibles**:
- `primary` / `primary-foreground`
- `secondary` / `secondary-foreground`
- `destructive` / `destructive-foreground`
- `muted` / `muted-foreground`
- `accent` / `accent-foreground`
- `card` / `card-foreground`
- `background` / `foreground`

---

### Shadcn UI

**Principio**: Componentes copiables, no librería

#### Agregar Nuevo Componente

```bash
# Instalar componente de Shadcn
npx shadcn-ui@latest add [component-name]

# Ejemplo
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add form
```

Esto crea el archivo en `src/components/ui/[component-name].tsx`

#### Uso de Componentes

```typescript
// ✅ Importa desde ui/
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog'

// ✅ Usa variantes predefinidas
<Button variant="default">Default</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline">Cancel</Button>
<Button variant="ghost">Ghost</Button>

// ✅ Usa tamaños predefinidos
<Button size="default">Default</Button>
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
<Button size="icon">Icon</Button>
```

---

### Animaciones con Framer Motion

```typescript
import { motion, AnimatePresence } from 'framer-motion'

// ✅ Animaciones de entrada/salida
<AnimatePresence>
  {isOpen && (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      Contenido
    </motion.div>
  )}
</AnimatePresence>

// ✅ Hover effects
<motion.div
  whileHover={{ y: -5, scale: 1.02 }}
  transition={{ duration: 0.2 }}
>
  Card
</motion.div>

// ✅ Variantes reutilizables
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
  hover: { y: -5 }
}

<motion.div
  variants={cardVariants}
  initial="hidden"
  animate="show"
  whileHover="hover"
>
  Card
</motion.div>
```

---

## 💾 Estado y Datos

### Cuándo Usar Cada Solución

| Necesidad | Solución | Ejemplo |
|-----------|----------|---------|
| Estado local de componente | `useState` | Modal abierto/cerrado |
| Estado derivado | Variable calculada | Nombre completo del usuario |
| Estado global del cliente | Zustand | UI state (sidebars, modals) |
| Datos del servidor | Server Actions | Usuarios, posts, etc |
| Caché del servidor | Next.js cache | Páginas estáticas |
| Formularios | React Hook Form | Crear usuario |

### Zustand - Estado Global

**Ejemplo de stores**:
```typescript
// UI (modals, sidebars, etc)
import { useUiStore } from '@/store'
const { isSidebarOpen, openSidebar, closeSidebar } = useUiStore()

// Preferencias de usuario
import { usePreferencesStore } from '@/store'
const { theme, language, setTheme, setLanguage } = usePreferencesStore()
```

**Reglas**:
- ✅ Usa Zustand solo para estado del cliente (UI, preferencias)
- ✅ Persiste solo lo necesario (tema, idioma, estado de sidebars)
- ❌ No uses Zustand para datos del servidor (usuarios, posts, etc)
- ❌ No dupliques datos entre Zustand y Server Components

---

### Server Actions - Datos del Servidor

**Patrón de uso en componentes**:

```typescript
'use client'

import { useState } from 'react'
import { createUser } from '@/actions/users/create-user'
import { toast } from 'sonner'

export function UserForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true)
    
    const { ok, message, user } = await createUser(formData)
    
    if (ok) {
      toast.success(message)
      // Opcional: redirigir o limpiar form
    } else {
      toast.error(message)
    }
    
    setIsSubmitting(false)
  }
  
  return (
    <form action={handleSubmit}>
      {/* Campos */}
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Guardando...' : 'Guardar'}
      </button>
    </form>
  )
}
```

---

## 📋 Validación y Formularios

### React Hook Form + Zod

**Patrón estándar**:

```typescript
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { userSchema } from '@/schemas/user.schema'
import { createUser } from '@/actions/users/create-user'
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export function UserForm() {
  const form = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: '',
      email: '',
      roleId: ''
    }
  })
  
  const onSubmit = async (values) => {
    const formData = new FormData()
    Object.entries(values).forEach(([key, value]) => {
      formData.append(key, String(value))
    })
    
    const { ok, message } = await createUser(formData)
    
    if (ok) {
      toast.success(message)
      form.reset()
    } else {
      toast.error(message)
    }
  }
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <Input placeholder="Nombre del usuario" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="usuario@ejemplo.com"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit">Guardar</Button>
      </form>
    </Form>
  )
}
```

**Reglas**:
- ✅ Usa `zodResolver` para validación
- ✅ Define `defaultValues` siempre
- ✅ Usa `FormField` para cada campo
- ✅ Convierte tipos en `onChange` cuando sea necesario (number, boolean)
- ✅ Usa `form.reset()` después de submit exitoso
- ❌ No valides manualmente (deja que Zod lo haga)

---

## 🔍 Reglas de ESLint

El proyecto usa **Standard TypeScript** con reglas personalizadas:

### Reglas Activas

```json
{
  "no-console": "warn",                    // ⚠️ Evita console.log
  "import/order": "error",                 // ❌ Ordena imports
  "react/prop-types": "off",               // ✅ No necesario con TS
  "react/react-in-jsx-scope": "off",       // ✅ No necesario en Next.js
  "@typescript-eslint/explicit-function-return-type": "off",
  "@typescript-eslint/no-misused-promises": "off",
  "@typescript-eslint/strict-boolean-expressions": "off"
}
```

### Orden de Imports

ESLint fuerza este orden:

```typescript
// 1. Built-in y externos
import { useState } from 'react'
import { motion } from 'framer-motion'

// 2. Internos (alias @/)
import { createProduct } from '@/actions/products/create-product'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { Product } from '@/lib/types'

// 3. Relativos
import { ProductCard } from './product-card'
import styles from './styles.module.css'
```

### Ejecutar Linter

```bash
# Verificar errores
pnpm lint

# Auto-fix
pnpm lint --fix
```

---

## 🛠️ Comandos Útiles

### Desarrollo

```bash
# Iniciar servidor de desarrollo
pnpm dev

# Build de producción
pnpm build

# Iniciar servidor de producción
pnpm start

# Linter
pnpm lint
```

### Prisma

```bash
# Generar cliente de Prisma
pnpm prisma:generate

# Ver base de datos en navegador
pnpm prisma studio

# Crear migración
pnpm prisma migrate dev --name [nombre]

# Aplicar migraciones
pnpm prisma migrate deploy

# Seed de base de datos
pnpm seed
```

### Shadcn UI

```bash
# Agregar componente
npx shadcn-ui@latest add [component]

# Ejemplos
npx shadcn-ui@latest add button
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add form
npx shadcn-ui@latest add table
```

---

### Commits

## 🧠 Commit Automation Behavior

Whenever the user requests anything related to committing changes (e.g., 
"commit this", "make the commit", "push my changes", "generate the commit"),
you MUST:

1. Detect uncommitted changes with `git diff`.
2. Analyze the diff and generate a commit message using EXACTLY this format:

   <type>: <gitmoji> <short summary>

   ### Changes Made
   - <type>: <gitmoji> <short change description>
   ...

   ### Description of Changes
   - Detailed explanation of what changed, why, impact, and any issues closed.

   Rules:
   - Summary max 50 characters
   - Each line max 50 characters
   - Always English
   - Allowed types: feat, fix, docs, style, refactor, perf, test, build, ci, chore, revert.

3. Automatically generate the branch name with:
   <type>/<kebab-case-summary>

4. Execute:
   git checkout -b <branch>
   git add .
   git commit -m "<full commit message>"
   git push -u origin <branch>

5. Respond to the user **only** with:
   - The commit message in Markdown
   - The generated branch name

## 🎯 Checklist para Nuevas Features

Antes de considerar una feature completa, verifica:

- [ ] **Tipos**: Definidos en `src/lib/types.ts`
- [ ] **Schema**: Creado en `src/schemas/[entity].schema.ts`
- [ ] **Server Actions**: Implementadas en `src/actions/[feature]/`
  - [ ] Validación con Zod
  - [ ] Manejo de errores
  - [ ] Revalidación de paths
  - [ ] Retorno consistente `{ ok, message, data }`
- [ ] **Componentes**: Creados en `src/components/[feature]/`
  - [ ] `'use client'` solo cuando sea necesario
  - [ ] Imports ordenados correctamente
  - [ ] Props tipadas
  - [ ] Loading states
  - [ ] Error handling
- [ ] **Rutas**: Creadas en `src/app/`
  - [ ] Server Components por defecto
  - [ ] `Suspense` para loading
  - [ ] Metadata (title, description)
- [ ] **Estilos**: Usando Tailwind y variables del tema
- [ ] **Accesibilidad**: Labels, ARIA, keyboard navigation
- [ ] **Responsive**: Mobile-first, breakpoints md/lg
- [ ] **Testing**: Probado en desarrollo

---

## 📚 Recursos Adicionales

### Documentación Oficial

- [Next.js 15 Docs](https://nextjs.org/docs)
- [React 19 Docs](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Prisma Docs](https://www.prisma.io/docs)
- [Zustand Docs](https://zustand-demo.pmnd.rs/)
- [Shadcn UI](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [React Hook Form](https://react-hook-form.com/)
- [Zod](https://zod.dev/)

---

## 🚨 Errores Comunes y Soluciones

### 1. "Cannot use import statement outside a module"
**Causa**: Archivo sin `'use client'` usando hooks o estado
**Solución**: Agrega `'use client'` al inicio del archivo

### 2. "Hydration mismatch"
**Causa**: Diferencia entre SSR y cliente (ej: `Date.now()`, `Math.random()`)
**Solución**: Usa `useEffect` o `'use client'` para código que depende del cliente

### 3. "Module not found: Can't resolve '@/...'"
**Causa**: Alias `@/` no configurado o import incorrecto
**Solución**: Verifica `tsconfig.json` y usa rutas absolutas desde `src/`

### 4. "Error: Cannot read properties of undefined"
**Causa**: Acceso a propiedad sin verificar existencia
**Solución**: Usa optional chaining `?.` o verifica antes

### 5. "Prisma Client not generated"
**Causa**: Cliente de Prisma no generado después de cambios en schema
**Solución**: Ejecuta `pnpm prisma:generate`

---

## 🎓 Filosofía del Proyecto

### Principios Fundamentales

1. **Simplicidad sobre complejidad**: Prefiere soluciones simples y directas
2. **Convención sobre configuración**: Sigue los patrones establecidos
3. **TypeScript estricto**: Tipado fuerte para prevenir errores
4. **Server-first**: Usa Server Components y Server Actions por defecto
5. **Validación en ambos lados**: Cliente para UX, servidor para seguridad
6. **Componentes pequeños**: Una responsabilidad por componente
7. **Estado mínimo**: Solo lo necesario en Zustand
8. **Accesibilidad**: Todos los componentes deben ser accesibles

---

**Última actualización**: 2026-01-24

**Versión del proyecto**: 1.1.0

---

> 💡 **Tip para LLMs**: Antes de hacer cambios, revisa esta guía para asegurar consistencia con los patrones del proyecto. Cuando tengas dudas, busca ejemplos similares en el código existente.