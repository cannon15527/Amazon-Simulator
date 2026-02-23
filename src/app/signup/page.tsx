'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Logo } from '@/components/logo';
import { useEffect } from 'react';

const formSchema = z.object({
  name: z.string().min(2, 'Please enter your name.'),
});

export default function SignUpPage() {
  const router = useRouter();

  useEffect(() => {
    if (localStorage.getItem('simushop_has_signed_up') === 'true') {
      router.replace('/');
    }
  }, [router]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // In a real app, you'd create a user account.
    localStorage.setItem('simushop_has_signed_up', 'true');
    // We can store the name if we want, maybe for later use.
    localStorage.setItem('simushop_user_name', values.name); 
    router.push('/');
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="items-center text-center">
          <Logo />
          <CardTitle className="pt-4 text-2xl font-bold">Create your account</CardTitle>
          <CardDescription>Welcome to the Amazon Simulator! Please create a virtual account to begin.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Jane Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                Start Shopping
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
