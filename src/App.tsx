import React, { useContext, useEffect, useState } from 'react'
import { ExtensionContext } from '@looker/extension-sdk-react'
import { IUser, IWriteQuery } from '@looker/sdk'

const query: IWriteQuery = {
    model: 'example_model',
    view: 'example_explore', // Reference the explore name here
    fields: ['view_name.field1', 'view_name.field2'],
    sorts: ['view_name.field1'],
    limit: '500'
}

const App: React.FC = () => {
    const context = useContext(ExtensionContext)
    const [user, setUser] = useState<IUser | null>(null)
    const [queryResults, setQueryResults] = useState('')

    if (!context) return <div>Loading Looker Extension...</div>

    const { extensionSDK, tileSDK } = context

    useEffect(() => {
        const getUser = async () => {
            if (context?.core40SDK) {
                const result = await context.core40SDK.ok(context.core40SDK.me())
                setUser(result)
            }
        }

        const runQuery = async () => {
            const result = await context?.core40SDK.ok(context?.core40SDK.run_inline_query({
                body: query,
                result_format: 'json',
            }))
            setQueryResults(result)
        }

        getUser()
        // runQuery()
    }, [context])

    return (
        <div className="wrapper">
            <header className="main">
                <h1>Simple Looker Extension 🚀</h1>
            </header>

            <section className="intro">
                <p>You're connected to: <strong>{extensionSDK?.lookerHostData?.hostUrl || 'Unknown'}</strong></p>
            </section>

            <section className="user-info">
                {user ? (
                    <>
                        👋 Hello, {user.display_name}! <br />
                        Your email is {user.email}.
                    </>
                ) : (
                    'Loading user info...'
                )}
            </section>
        </div>
    )
}

export default App