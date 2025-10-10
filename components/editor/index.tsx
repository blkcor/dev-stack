'use client'

import './dark-editor.css'
import '@mdxeditor/editor/style.css'
import { type Extension } from '@codemirror/state'
import {
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  markdownShortcutPlugin,
  MDXEditor,
  type MDXEditorMethods,
  type MDXEditorProps,
  toolbarPlugin,
  ConditionalContents,
  ChangeCodeMirrorLanguage,
  UndoRedo,
  Separator,
  BoldItalicUnderlineToggles,
  ListsToggle,
  CreateLink,
  InsertImage,
  InsertTable,
  InsertThematicBreak,
  InsertCodeBlock,
  linkPlugin,
  codeBlockPlugin,
  linkDialogPlugin,
  tablePlugin,
  imagePlugin,
  codeMirrorPlugin,
  diffSourcePlugin,
} from '@mdxeditor/editor'
import { basicDarkTheme } from 'cm6-theme-basic-dark'
import { useTheme } from 'next-themes'
import { ForwardedRef, useEffect, useState } from 'react'

export default function Editor({
  editorRef,
  value,
  fieldChange,
  ...props
}: {
  editorRef: ForwardedRef<MDXEditorMethods> | null
  value: string
  fieldChange: (...event: any[]) => void
} & Omit<MDXEditorProps, 'markdown'>) {
  const { resolvedTheme } = useTheme()

  const theme = resolvedTheme === 'dark' ? [basicDarkTheme] : []

  return (
    <MDXEditor
      key={resolvedTheme}
      markdown={value}
      onChange={fieldChange}
      className='background-light800_dark200 light-border-2 markdown-editor dark-editor w-full border'
      plugins={[
        headingsPlugin(),
        listsPlugin(),
        linkPlugin(),
        linkDialogPlugin(),
        tablePlugin(),
        imagePlugin(),
        codeBlockPlugin({
          defaultCodeBlockLanguage: '',
        }),
        codeMirrorPlugin({
          codeBlockLanguages: {
            // Web Technologies
            css: 'css',
            html: 'html',
            javascript: 'javascript',
            js: 'js',
            typescript: 'typescript',
            ts: 'ts',
            jsx: 'jsx',
            tsx: 'tsx',
            json: 'json',
            xml: 'xml',
            svg: 'svg',

            // Backend Languages
            python: 'python',
            py: 'py',
            java: 'java',
            csharp: 'csharp',
            cs: 'cs',
            cpp: 'cpp',
            c: 'c',
            php: 'php',
            ruby: 'ruby',
            rb: 'rb',
            go: 'go',
            rust: 'rust',
            rs: 'rs',
            swift: 'swift',
            kotlin: 'kotlin',
            kt: 'kt',
            scala: 'scala',

            // Shell/Scripting
            bash: 'bash',
            sh: 'sh',
            shell: 'shell',
            powershell: 'powershell',
            ps1: 'ps1',
            batch: 'batch',

            // Database & Query
            sql: 'sql',
            mysql: 'mysql',
            postgresql: 'postgresql',
            graphql: 'graphql',

            // Markup & Data
            markdown: 'markdown',
            md: 'md',
            yaml: 'yaml',
            yml: 'yml',
            toml: 'toml',

            // Other
            diff: 'diff',
            dockerfile: 'dockerfile',
            makefile: 'makefile',
            nginx: 'nginx',
            apache: 'apache',
            regex: 'regex',
            plaintext: 'plaintext',
            text: 'text',
            '': '',
          },
          autoLoadLanguageSupport: true,
          codeMirrorExtensions: theme,
        }),
        diffSourcePlugin({
          viewMode: 'rich-text',
          diffMarkdown: '',
        }),
        quotePlugin(),
        thematicBreakPlugin(),
        markdownShortcutPlugin(),
        toolbarPlugin({
          toolbarContents: () => {
            return (
              <ConditionalContents
                options={[
                  {
                    when: editor => editor?.editorType === 'codeblock',
                    contents: () => <ChangeCodeMirrorLanguage />,
                  },
                  {
                    fallback: () => {
                      return (
                        <>
                          <UndoRedo />
                          <Separator />

                          <BoldItalicUnderlineToggles />
                          <Separator />

                          <ListsToggle />
                          <Separator />

                          <CreateLink />
                          <InsertImage />
                          <Separator />

                          <InsertTable />
                          <InsertThematicBreak />
                          <InsertCodeBlock />
                        </>
                      )
                    },
                  },
                ]}
              />
            )
          },
        }),
      ]}
      {...props}
      ref={editorRef}
    />
  )
}
