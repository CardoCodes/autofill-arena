"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Trash2 } from "lucide-react"
import * as React from "react"

export interface JobItem {
  id: string
  company: string
  position: string
  start_date: string
  end_date: string
  description: string
  isNew?: boolean
}

export interface EducationItem {
  id: string
  school: string
  degree: string
  field_of_study: string
  graduation_date: string
  isNew?: boolean
}

export interface ProjectItem {
  id: string
  name: string
  description: string
  technologies: string
  isNew?: boolean
}

type Kind = 'job' | 'education' | 'project'

type EditableListProps =
  | { kind: 'job'; items: JobItem[]; isDarkMode: boolean; onChange: (next: JobItem[]) => void; onRemove: (id: string) => void; onAdd: () => void }
  | { kind: 'education'; items: EducationItem[]; isDarkMode: boolean; onChange: (next: EducationItem[]) => void; onRemove: (id: string) => void; onAdd: () => void }
  | { kind: 'project'; items: ProjectItem[]; isDarkMode: boolean; onChange: (next: ProjectItem[]) => void; onRemove: (id: string) => void; onAdd: () => void }

export function EditableList(props: EditableListProps) {
  const { isDarkMode, onRemove, onAdd } = props

  return (
    <div className="space-y-4">
      {props.items.map((item, index) => (
        <div key={item.id} className={`p-4 ${isDarkMode ? "bg-[#282a36] text-[#f8f8f2]" : "bg-white text-[#1a1a1a]"} rounded-lg relative group space-y-4`}>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onRemove(item.id)}
            className={`absolute right-2 top-2 opacity-0 group-hover:opacity-100 text-[#ff5555] ${isDarkMode ? "hover:bg-[#44475a] text-[#f8f8f2]" : "hover:bg-gray-100 text-[#1a1a1a]"}`}
          >
            <Trash2 className="h-4 w-4" />
          </Button>

          {props.kind === 'job' && renderJob(props.items[index] as JobItem, index)}
          {props.kind === 'project' && renderProject(props.items[index] as ProjectItem, index)}
          {props.kind === 'education' && renderEducation(props.items[index] as EducationItem, index)}
        </div>
      ))}
      <Button
        variant="outline"
        size="sm"
        onClick={onAdd}
        className={`transition-all duration-300 ${
          isDarkMode
            ? "text-[#f8f8f2] border-[#44475a] bg-[#282a36] hover:bg-[#44475a]"
            : "text-[#1a1a1a] border-gray-300 bg-white hover:bg-gray-100"
        }`}
      >
        <Plus size={16} className="mr-1" /> Add
      </Button>
    </div>
  )

  function renderJob(item: JobItem, index: number) {
    return (
      <>
        <KeyValue label="Company" value={item.company} onChange={(v) => updateJob(index, { company: v })} />
        <KeyValue label="Position" value={item.position} onChange={(v) => updateJob(index, { position: v })} />
        <div className="grid grid-cols-2 gap-4">
          <KeyValue label="Start Date" value={item.start_date} type="date" onChange={(v) => updateJob(index, { start_date: v })} />
          <KeyValue label="End Date" value={item.end_date} type="date" onChange={(v) => updateJob(index, { end_date: v })} />
        </div>
        <div className="space-y-2">
          <Label>Description</Label>
          <Textarea value={item.description} onChange={(e) => updateJob(index, { description: e.target.value })} className="bg-transparent min-h-[100px]" />
        </div>
      </>
    )
  }

  function renderProject(item: ProjectItem, index: number) {
    return (
      <>
        <KeyValue label="Project Name" value={item.name} onChange={(v) => updateProject(index, { name: v })} />
        <div className="space-y-2">
          <Label>Description</Label>
          <Textarea value={item.description} onChange={(e) => updateProject(index, { description: e.target.value })} className="bg-transparent" rows={3} />
        </div>
        <KeyValue label="Technologies Used" value={item.technologies} onChange={(v) => updateProject(index, { technologies: v })} />
      </>
    )
  }

  function renderEducation(item: EducationItem, index: number) {
    return (
      <>
        <KeyValue label="School" value={item.school} onChange={(v) => updateEducation(index, { school: v })} />
        <KeyValue label="Degree" value={item.degree} onChange={(v) => updateEducation(index, { degree: v })} />
        <KeyValue label="Field of Study" value={item.field_of_study} onChange={(v) => updateEducation(index, { field_of_study: v })} />
        <KeyValue label="Graduation Date" value={item.graduation_date} type="date" onChange={(v) => updateEducation(index, { graduation_date: v })} />
      </>
    )
  }

  function updateJob(i: number, partial: Partial<JobItem>) {
    const next = [...(props.items as JobItem[])]
    next[i] = { ...next[i], ...partial }
    props.onChange(next as any)
  }

  function updateProject(i: number, partial: Partial<ProjectItem>) {
    const next = [...(props.items as ProjectItem[])]
    next[i] = { ...next[i], ...partial }
    props.onChange(next as any)
  }

  function updateEducation(i: number, partial: Partial<EducationItem>) {
    const next = [...(props.items as EducationItem[])]
    next[i] = { ...next[i], ...partial }
    props.onChange(next as any)
  }
}

function KeyValue({ label, value, onChange, type = 'text' }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Input type={type} value={value} onChange={(e) => onChange(e.target.value)} className="bg-transparent" />
    </div>
  )
}


